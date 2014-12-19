# Introduction
Continuous Delivery (CD) is a design practice used in software development to automate and improve the process of software delivery. Techniques such as automated testing, continuous integration and continuous deployment allow software to be developed to a high standard and easily packaged and deployed to test environments, resulting in the ability to rapidly, reliably and repeatedly push out enhancements and bug fixes to customers at low risk and with minimal manual overhead.  
  
This node module aims to listen to change in repositories in Bitbucket and Github and if the repository and branch matches, it would run a specific script to suit your needs such as deploy script. You will need to set up hooks in Bitbucket or Github repository and then also deploy the script and repo to each of ur machine.

# Installation
**Install on server**
Pull the repository from the server and install and run its module, a sample config.json and bash script file need to be in place before it can run. The bash script need to be executable, so permission change might be needed.
```
$ npm install 
$ npm start    // PORT=80, and config=config.json in root folder
```

# Release




