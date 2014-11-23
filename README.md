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



Developer Notes
========
Ref: http://docs.python-guide.org/en/latest/dev/virtualenvs/


Virtual Environment Setup

* Step 1: Make a folder to house your virtual environments eg. ~/sites/virtual\_environments
* Step 2: CD into this folder
* Step 3: Run `virtualenv arts612`
* Step 4: edit your ~/.bash\_profile and add the line: alias xart612='cd ~/sites/arts-612/ && export VENV_PATH=~/sites/virtual_environments/arts-612 && echo $VENV_PATH && source ${VENV_PATH}/bin/activate'
* Step 5: Open a new shell and run the newly created alias `xarts612`
* Step 6: Run `make install`
* Step 7: run `python run_tests.py` If everything passes, you are probably good to go.

Developing for react (pre-client)
* In working directory, run `jsx --watch static/admin/js/react/src/ static/admin/js/react/build/`
