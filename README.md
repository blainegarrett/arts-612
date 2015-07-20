mplsart.com
========
> This is the codebase for the mplsart.com website.

Documentation:

*   [Developers Guide](/docs/api/)
	* [Overview of Tech Stack](/docs/dev/tech-stack)
	* [Getting Started](/docs/dev/getting-started)
	* [Deploying](/docs/dev/deploying)
	* [Developing](/docs/dev/developing)
	* [REST Api Documentation]((/docs/api/))
*   [Style Guide(/docs/style-guide)



Installation Notes
========
Ref: http://docs.python-guide.org/en/latest/dev/virtualenvs/

**Checkout Project From Github**

The first step is to install the *arts-612* project from the project page at: [https://github.com/blainegarrett/arts-612](https://github.com/blainegarrett/arts-612)
I highly recommend using Source Tree. However, the command line works fine as well.

Install the project to **~/sites/arts-612/** or wherever you chose. This path is assumed to be the install path through the rest of the documentation.


**Virtual Environment Setup**

* Step 1: Make a folder to house your virtual environments eg. **~/sites/virtual\_environments**
* Step 2: CD into this folder
* Step 3: Run `virtualenv arts612`
* Step 4: edit your ~/.bash\_profile and add the line: 
	``alias xart612='cd ~/sites/arts-612/ && export VENV_PATH=~/sites/virtual_environments/arts-612 && echo $VENV_PATH && source ${VENV_PATH}/bin/activate'``
* Step 5: Open a new shell and run the newly created alias `xarts612`
* Step 6: Run `make install` - This will install any python dependencies
* Step 7: run `make unit` If everything passes, you are probably good to go.

**Installing client code**

* Step 1: edit your ~/.bash\_profile and add the line: ``ulimit -n 2560`` This addresses a browserify bug on mac dealing with # of files to watch
* Step 2: Open a new shell (or reload)
* Step 3: Run ``npm install`` If this finishes, then we're close...
* Step 4: Run ``gulp browserify`` If this errors, ensure that the ulimit change was made above
* Step: In a separate shell, run ``dev_appserver .`` and open the site in your browser. If the home screen loads, then you're golden.
