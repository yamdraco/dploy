# Introduction
Continuous Delivery (CD) is a design practice used in software development to automate and improve the process of software delivery. Techniques such as automated testing, continuous integration and continuous deployment allow software to be developed to a high standard and easily packaged and deployed to test environments, resulting in the ability to rapidly, reliably and repeatedly push out enhancements and bug fixes to customers at low risk and with minimal manual overhead.  
  
This node module aims to listen to change in repositories in Bitbucket and Github and if the repository and branch matches, it would run a specific script to suit your needs such as deploy script. You will need to set up hooks in Bitbucket or Github repository and then also deploy the script and repo to each of ur machine.

The application runs on express server and listen to a specific port in github

# Installation
**Install on server**
Pull the repository from the server and install and run its module, a sample config.json and bash script file need to be in place before it can run. The bash script need to be executable, so permission change might be needed.
```
$ npm install 
$ npm start    // PORT=80, and config=config.json in root folder
```

add config.json into the folder
add script into scripts folder

# TODO:
* Update modules and dependencies
* Include test on config.json
* Include test on github hooks
* Include function to test for connection

# Config
```
{
  "accepts": [
    {   
      "hostname": "test"
    , "branch": "production"
    , "script": "./scripts/test_scripts.sh"
    , "repository": "/marcus/project-x/"
    }   
  ]
}
```
hostname is the name of the server in digial ocean / amazon  
branch is the branch you would like to listen to  
script is the script file to run  
repository is the repository name on github / bitbucket

# Release
### 20150904 (v0.0.1)
* By Draco
* listen to hook from github (by whitelist ip)
* listen to hook from bitbucket (by whitelist ip)


