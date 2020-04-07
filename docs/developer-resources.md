# Developer Resources

This document contains as many helpful instructions for future software engineering senior project teams as I could think of. All of the instructions are written with two assumptions:

1. Unix (Linux/MacOS) operating system. I am 100% aware that there will be future users on Windows, but it wasn't feasible to write everything twice so you will need to adjust accordingly. The main reason this is written with Unix in mind is because the VM runs on Ubuntu. If you use Windows 10 you can look into [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) although keep in mind that this is not a simple process at all and has a few drawbacks as there's essentially two operating systems that may end up fighting each other at times. I do use it on my desktop though and would definitely recommend it over command prompt.
2. IntelliJ IDEA. This isn't necessary but it has a lot of useful features that we have come to appreciate in this project. As an RIT student you are able to get the professional edition for [free](https://www.jetbrains.com/community/education/) by providing your .edu email address which I recommend because it has a few features that help for this project.
3. Most importantly, this is not an exhaustive list and it assumes some basic knowledge. If you're truly struggling you can reach out to [me](benvogler1@gmail.com).

## Local Setup

1. Set up SSH keys with the VM

   1. It's important to note that there's a number of ways to go about doing this depending on your operating system/SSH client. This example will use regular unix SSH commands. If you're using PUTTY for example, you will need to look into how to do this stuff via PUTTY.

   2. Download the default private key for the VM, which is provided in the [#setup](https://app.slack.com/client/TMU604V63/C011H12GV7F) slack channel

   3. Create your own SSH key if you don't already have one

      ```bash
      $ ssh-keygen
      ```

   4. Because the ubuntu user does not allow password authentication, you cannot use `ssh-copy-id`. One way to add your public key is to connect with the provided private key and then add your public key to `~/.ssh/authorized_keys`. You can do this quickly through SSH, for example:

      ```bash
      $ cat ~/.ssh/id_rsa.pub | ssh ubuntu@monuments.us.org -i monuments.pem "cat >> ~/.ssh/authorized_keys"
      ```

   5. You can now delete `monuments.pem` from your local system. I recommend every user have their own private/public key to make access management easier. If you want to revoke access to a user you should create a new public/private key to take the place of `monuments.pem`, remove the first public key from `~/.ssh/authorized_keys` and replace it with the new key you've created. Then remove the individual users' public keys from `~/.ssh/authorized_keys`. This is obviously not ideal, so you could go about setting up individual admin users for each user and deleting them as necessary.

2. Install Postgres. At the time of writing this we're using Postgres 12.1 for both client and server. There are many ways to install Postgres depending on operating system so I won't go into detail here. For Linux, you can see instructions in the [VM setup guide](https://github.com/team-monumental/monuments-and-memorials/blob/master/docs/vm-setup.md). You will probably also want to install [pgAdmin](https://www.pgadmin.org/) if not already included in your install if you want a visual Postgres client.

   1. Once installed, you need to do some configuration. You will first need to connect to the default postgres user. This can be tricky depending on operating system because some Unix installs expect you to make an actual `postgres` system user and connect using that. You can change this behavior by following [this guide](https://www.liquidweb.com/kb/change-postgresql-authentication-method-from-ident-to-md5/).

   2. Once connected, change the password to password. Yep, really, password. Our hibernate config is shared by everyone, so it needs to be something basic like password.

      ```plsql
      \passwd
      ```

   3. By default, your postgres server should have the `postgres` database created, but if it doesn't you'd have to create it yourself

      ```plsql
      CREATE DATABASE postgres;
      ```

   4. To verify that everything is working correctly, disconnect from postgres

      ```plsql
      \q
      ```

      Then connect again

      ```bash
      $ psql postgres postgres
      ```

      You should be prompted for a password, and you should enter `password`. At this point if you're at the SQL prompt, you've done everything correctly.

   5. Next, you need to install two extensions, `pgtrgm` and `postgis`. Depending on how you installed postgres, these may already be available to you. In pgAdmin, right click the extensions tab and create a new one. Search for these two extensions and add them if they're available. If they're not available, you need to install them to your postgres server. This will vary depending on your operating system and how you installed postgres. Generally `pgtrgm` is always included, so for `postgis` instructions try https://postgis.net/install/

3. Clone the repository

   1. If you're using IntelliJ IDEA, create a new `Project from Version Control` using https://github.com/team-monumental/monuments-and-memorials.git. Once the project is created, there are a couple setup steps

      1. Make sure the Gradle project is imported into IntelliJ automatically. If it is, you will see a Gradle tab somewhere (probably the right side of the editor). If not, you may need to open `build.gradle` and try to get IntelliJ to pick up on it. Once it's imported as a Gradle project, it should either grab the dependencies automatically or you can run the build and it should pull them in.

      2. Open `Application.java` and you should be able to run the file. Do so and make sure the server starts without error. You may see some exceptions in the startup log, including one related to sending emails. You can ignore that exception as that's intended, as you don't want to accidentally be sending emails.

      3. Create a file in `/client` called `.env`. In this file, you can configure your API keys provided in the [#setup](https://app.slack.com/client/TMU604V63/C011H12GV7F) slack channel.

      4. Open `package.json` and run the install when IntelliJ asks. If it doesn't ask you may need to run it manually

         ```bash
         $ cd client
         $ npm install
         ```

         Then, run the `start` script and in a few seconds a tab should open in your browser automatically at `localhost:3000`

   2. Otherwise, clone the repo as normal and set it up in your editor

      ```bash
      $ git clone https://github.com/team-monumental/monuments-and-memorials.git
      ```

      1. Run the Gradle build. This should download all the dependencies.

         ```bash
         $ ./gradlew build
         ```

      2. Start the server

         ```bash
         $ java -jar build/libs/monuments-and-memorials-0.0.1-SNAPSHOT.jar
         ```

      3. Run the npm install and start the React server.

         ```bash
         $ cd client
         $ npm install
         $ npm start
         ```

      4. Go to http://localhost:3000 if a browser tab does not open automatically

4. Verify that everything's working

   1. At http://localhost:3000, click around and make sure the UI looks the same as https://monuments.us.org/ (without any data).

   2. Click the sign up button and try to sign up. It should succeed. Now, connect to postgres and make yourself an admin user.

      ```bash
      $ psql postgres postgres
      ```

      ```plsql
      UPDATE "user" SET role = 'ADMIN' RETURNING *;
      ```

      You should see information about the user you just created returned.

   3. In your browser, log out and log back in. You should now be able to access the admin panel.

5. You can get some data into your database for testing by doing a bulk create from the admin panel using one of the initial data dumps from Dr. Decker's classes. The most up to date version in the Google Drive should upload without an warnings or errors.

## Deploying

1. Complete **Local Setup** above

2. Checkout the version of the application you want to deploy (this should always be master)

   ```bash
   git fetch origin
   git checkout -b master origin/master 
   git pull
   ```

3. Add the VM as a git remote named `deploy`

   ```bash
   git remote add deploy ubuntu@monuments.us.org:/home/monumental/monuments-and-memorials 
   ```

4. Deploy

   ```bash
   git push deploy master 
   ```

   1. If you're pushing from a branch other than master,

      ```bash
      git push deploy my-branch:master
      ```

      Please note that if you do this, you will need to force push in the future to get the branch back to the real state of master.

## Project Structure

To get a good sense of how the project works, please check out the documentation in the Google Drive folder. The architecture diagram and document are way out of date and I don't have time to update them so I'm just going to brain dump here a bit.

### Database Tier

#### PostgreSQL

Database. Pretty straightforward.

##### pgtrgm

PostgreSQL extension responsible for word matching, which is what you see in the first search box on the site.

##### postgis

PostgreSQL extension used for storing coordinates and searching against them using a radius around a provided point, which is part of what you see in the second search box. The other piece of the location search is the Google Maps API which I'll talk more about below.

### Server Tier 

The server is written in Java using Spring Boot. We chose Spring Boot because it does a lot of heavy lifting for us and our team had experience with Java.

#### Hibernate/JPA

Hibernate is the ORM we use to interact with Postgres from within Spring Boot. You will see the term JPA thrown around a lot, this is basically the standard API for ORMs that Java now has, and a lot of old Hibernate-specific functionality has been updated to use the JPA standard. If this is confusing, just know that if there's a Hibernate way of doing something and a JPA way of doing something using Hibernate, you want to use the JPA way of doing something using Hibernate as this is the newest way to use Hibernate.

For example, we use `JpaRepository` classes to do our CRUD operations. This is an interface provided by JPA that connects to Postgres using Hibernate. Hibernate is responsible for turning Java into SQL and vice versa, while JPA is responsible for giving us the useful tools to interact with Hibernate such as `JpaRepository`.

#### Packages

##### com.monumental.models

These classes define our database tables. `Model` is not a Hibernate/JPA word, it's our word for Hibernate `Entity` classes because they all extend from the abstract `Model` class which provides some common functionality to all the `Model` classes.

##### com.monumental.repositories

These classes handle all of our CRUD interactions with the database. Each Repository is responsible for a specific `Model`. `JpaRepository` is extremely powerful and implements your methods for you automatically using reflection, based on the name of the method and any annotations you provide. For example `void deleteAllByName(String name);` would automatically be implemented to delete all of the rows in the table with matching `name` fields. I highly recommend taking the time to learn repositories as they will save you lots of development time when used effectively.

##### com.monumental.services

These classes are more on the Spring Boot side of things than the JPA/Hibernate side of things. They are responsible for all the business logic related to a specific `Model`. Each class extends the abstract class `ModelService` which provides some common functionality to each of the services, just like `Model` does to the model classes.

##### com.monumental.controllers

These are standard issue Spring Boot `RestController` classes. They use `ModelService` classes primarily to do the business logic, but for small things may sometimes directly call `JpaRepository` classes. If a controller method is more than 5 lines long, it probably can be moved into the appropriate `ModelService` class (we're not always great at following this rule).

##### com.monumental.security

This is a special package with a few key classes that configure Spring Boot Security to work with our `User` model and configure it to meet our needs. You shouldn't really need to touch this package too much, but it's important to know that:

1. `JpaAuditConfiguration#getCurrentAuditor` is responsible for finding the logged in user's `User` row in the database
2. `ProductionSecurityConfig` is responsible for switching on HTTPS in production (so that you don't need to set up SSL locally)
3. `SecurityConfig` is responsible for setting up `/api/login` and `/api/logout`, as well as making most the api endpoints **un**authenticated because the endpoints then define their own authentication using `@PreAuthorize`
4. `UserAwareUserDetails` is our custom session object that holds a reference to the appropriate `User` row returned by `JpaAuditConfiguration#getCurrentAuditor`.
5. `UserDetailsServiceImpl` is responsible for implementing `/api/login`.

##### com.monumental.util

This is kind of the garbage dump of everything that doesn't fit in one of the above packages. It has some useful utils for basic Java things as well as some more complex things, such as `AsyncJob`s for handling long running requests in a separate thread (such as for bulk operations).

### Client Tier

The client is a React app created with `create-react-app`. Note that this app has **not** been ejected, which means you still must use `react-scripts` to build and run it. I would strongly advise against ever ejecting the project. It should not be necessary as we use a very standard React setup.

#### Folders

We categorize our React components by three criteria:

1. Is it stateful - Does it keep state, is it connected to Redux, is it aware of React Router, etc.
2. Is it presentational - Is it concerned about the way things look to the user.
3. Is it a page, or not a page - We make this distinction because it helps keep things organized.

##### pages

This folder contains the components that server as page entry points. These components are **stateful** and **non-presentational**. They render components from the `components` and `containers` folders. These components should generally only be rendered by `<Route>`s in `App.js` but there are a couple key exceptions, such as on the admin panel where we render the `SearchPage` within the `AdminPage`.

##### containers

These are just like pages except, well, they're not pages. This folder isn't used much but we liked the distinction so it's there for the few **non-presentational**, **stateful** components that are **not pages**.

##### components

These are the bulk of the components, they are **non-stateful** and **presentational**. What that means is that they don't do things like consumer Redux reducers or dispatch Redux actions. They may have state if it's related to the presentation, i.e. if you need to track whether or not a modal is showing but they shouldn't have state from Redux.

##### actions

These are pretty typical [Redux actions](https://redux.js.org/basics/actions). Most of them are asynchronous actions thanks to [Redux Thunk](https://github.com/reduxjs/redux-thunk). They are basically responsible for doing things, and then reporting the results of those things to the [Redux store](https://redux.js.org/api/store) so that **stateful** components can see the results.

##### reducers

In order for the results of actions to actually be visible in the Redux store, you need a [Redux reducer](https://redux.js.org/basics/reducers) which basically takes the results of the action, gives it a name that **stateful** components can look for in the redux store, and makes any transformations to the data necessary. Most of our reducers follow the exact same pattern, so we abstracted this out to `utils/basic-reducer.js`. A few reducers are either more complex, or were created before we created `basicReducer`, so they may do things a little differently.

If you create a reducer, you need to register it with Redux by adding it to the `reducers.js` file.

#### SCSS

We use [SCSS](https://sass-lang.com/documentation/syntax) (or SASS) instead of regular CSS3. This gives a bunch of cool new features out of the box as well as some provided by the [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/) SCSS. Something important to keep in mind is that these files are **not** scoped to the component they're imported into. You **can** scope them easily by changing the file extension to `.module.scss`, at this time we have not done this because changing all the files to this required work to fix a number of issues so we decided it was not a good use of time for now. Our general strategy is that we manually scope by giving each page a unique class such as `<div className="search page"`  and then use this as the root selector for subsequent SCSS files

```scss
.search.page {
    .example {
        // Scoped to the correct page.
    }
}
```

Admittedly this is a bit of a mess and has caused issues in the past, so moving to `.module.scss` would be a good choice.

#### NPM Packages

I won't mention every single package here, but I'll go over the big ones

##### Bootstrap 4

As previously mentioned, we use Bootstrap as our CSS framework, and also use [React Bootstrap](https://react-bootstrap.github.io/). Generally we try to stick to using Bootstrap as much as possible, including using classes like `className="d-flex justify-content-center"` instead of creating classes for lots of individual elements which would get messy. Once an element has more than three or so classes we usually give it a custom class name and just modify it from the SCSS file. We never use `style` attributes unless necessary to modify a style via React. There are a couple usages of `!important` since the Bootstrap CSS uses them in some places, but we generally try to avoid this.

##### Leaflet

We use leaflet for a few maps on the site that Google Maps would not work well with. These are the big map at https://monuments.us.org/map and the search results map. Leaflet works well for these because it can handle lots of pins on a single page, and is completely free to use.

##### React Helmet

This is used to give pages dynamic titles and should be used as often as necessary to give pages detailed page titles.

##### Redux and Redux Thunk

As mentioned in the **components** section above, these are used for global state management, such as when we make API calls. See the **components** section for useful links for learning these packages. They are critical to being able to work in the React app.

### Third Party APIs

#### Server-Side

##### Google Maps API

On the server-side, we use the Google Maps API to:

1. Geocoding (turn street addresses into coordinates)
2. Reverse Geocoding (turn coordinates into approximate street addresses)

##### Amazon AWS

The server is hosted on AWS EC2, with Elastic IP used to keep a static domain name on the EC2 (so if you restart it or create a new one, you don't need to update our DNS to use the new IP).

We use the AWS SDK to upload images to the S3 image bucket so that they're publicly visible. The URL is stored on the image row in the database, so the client-side doesn't use the S3 API at all to retrieve them.

We also use AWS SES to send outbound emails. These are routed through SES and costs us some money per email but keeps our email reputation high (keeps our emails from going to spam).

#### Client-Side

##### Google Maps API

On the client-side, we use the Google Maps API to:

1. Get autocomplete results (with coordinates) for the location search box at the top of every page
2. Display a map of the location on a monument page (note that on other pages we use Leaflet for maps)

##### Leaflet

See **Leaflet** in the **NPM Packages** section above. Using Leaflet does make some external API calls to get the map images but this is handled for us automatically.

**Amazon AWS**

We retrieve images without the use of the S3 API by using direct urls provided by our server/database. At the time of writing this, we upload individual images to S3 on the client-side but are moving towards doing this on the server-side, which is where we currently upload images that come through the bulk upload process. We are moving these uploads to the server-side because it handles the logic for preventing replacing existing images if one has the same filename in S3, and rather than duplicate this logic in Javascript we would rather all images be uploaded through one process.

#### Other

##### Namecheap

The domain name `monuments.us.org` is registered through [namecheap.com](https://namecheap.com) and is where we configure our DNS for the domain. You shouldn't really have to touch anything there because AWS Elastic IP is used to keep the domain name for our EC2 static.

##### Zoho Mail

We use the free version of [Zoho Mail](https://mail.zoho.com) to register three email addresses at our domain name. The reason we use this is because setting up our own email server is quite complex, and every other alternative costs money per email address. There are some serious drawbacks, namely that you cannot setup email forwarding without paying them money. If down the road it's decided to change providers, you will need to modify the DNS records at Namecheap to point to the new email server. Check out the [control panel](https://mailadmin.zoho.com/cpanel/index.do#dashboard/general) (log in as Juilee) for all the admin functionality.

##### Lets Encrypt/Certbot

We use [Lets Encrypt](https://letsencrypt.org/) for free SSL certificates. You can learn all about this [here](https://github.com/team-monumental/monuments-and-memorials/blob/master/docs/ssl-setup.md).