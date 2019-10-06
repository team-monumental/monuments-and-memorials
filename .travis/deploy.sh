#!/bin/bash
if [[ $TRAVIS_BRANCH = "master" ]] && ! $TRAVIS_PULL_REQUEST; then
  echo "Deploying"
  eval "$(ssh-agent -s)" #start the ssh agent
  chmod 600 .travis/id_rsa
  ssh-add .travis/id_rsa
  git remote add github https://github.com/team-monumental/monuments-and-memorials.git
  git fetch github
  echo "fetched, checking out $TRAVIS_BRANCH"
  git reset --hard
  git checkout --track github/$TRAVIS_BRANCH
  git reset --hard $TRAVIS_COMMIT
  echo "adding remote"
  git remote add deploy monumental@monumental.se.rit.edu:/home/monumental/monuments-and-memorials
  echo "pushing"
  ssh-keyscan monumental.se.rit.edu >> ~/.ssh/known_hosts
  git push -f deploy $TRAVIS_BRANCH:master
  echo "after push"
else
  echo "Not a merge - not deploying"
fi