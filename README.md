# Monuments and Memorials

**Team Monumental**


## Deploying

1. Set up SSH keys with the VM
    1. Generate an ssh key if you do not already have one
        ```bash
        $ ssh-keygen
        ```
    2. Add your key to the VM (requires password authentication)
        ```bash
        $ ssh-copy-id -i ~/.ssh/id_rsa monumental@monumental.se.rit.edu 
        ```
2. Checkout the version of the application you want to deploy (this should always be master)
    ```bash
    git fetch origin
    git checkout -b master --track origin/master 
    git pull
    ```
3. Add the VM as a git remote
    ```bash
    git remote add deploy monumental@monumental.se.rit.edu:/home/monumental/monuments-and-memorials 
    ```
4. Deploy
    ```bash
    git push deploy master 
    ```
    1. If you're pushing from a branch other than master,
        ```bash
        git push deploy my-branch:master
        ```
    2. 