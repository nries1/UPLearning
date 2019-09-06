# UPLearning

UPLearning consists of several web apps.

Each folder contains all of the files needed to run a web app. The title of the folder tells you which web app it contains.

If a web app's folder contains a src directory and a lib directory, then is is being compiled using babel. The lib directory should contain 
a .clasp file that allows it to use the GAS CLI application `clasp` to push and pull local script files to the Google Drive repository where
UPLearning lives.

If a web app's folder doesn't contain a lib or source directory, then it will have a .clasp file in it's root and all of the visible web files
will be pushed to the Google Drive Repo.

*Note: You can only push files using clasp from the LIB file or a web app's parent folder

The file structure appears as follows

- Root
  + packag-lock.json
  + package.json
  ** SHOULD NOT contain .clasp.json or .babelrc **
  
- Web App 1
  - src
    ** These are the ES5+ syntax files before babel compiles them**
    ** src SHOULD NOT be pushed to the GDrive repo **
  - lib
    ** These are the ES- syntax files after babel compilation **
    ** lib should contain a .clasp file so that it can be pushed to the GDrive repo **
    .clasp.json
  .babelrc
  .package.json
  .package-lock.json
  
- Web App 2
  ** This app doesn't make use of babel, so it should just contain a list of .js and .html files **
  ** It should not contain any sub-directories **
  ** It should contain a .clasp.json file **
  
+ Web App 3

+Web App 4
  
