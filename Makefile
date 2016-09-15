PYTHON_SITE_PACKAGES_PATH := \
	$(shell python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")

help:
	@echo "TODO: Write the install help"

clean-pyc:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +

install:
	npm install
	pwd
	@echo "npm packages installed! Installing python packages..."
	pip install -r requirements_dev.txt
	linkenv $(PYTHON_SITE_PACKAGES_PATH) app/external
	@echo "Yay! Everything installed."


unit:
	nosetests -sv -a is_unit --with-gae --gae-application=app --with-yanc

integrations:
	nosetests -sv --with-gae --gae-application=app --with-yanc


coverage:
	nosetests -sv --with-gae --gae-application=app --with-yanc --with-coverage  --cover-package=app --cover-erase


client-dev:
	# Builds the Phase 2 client
	@echo "Run gulp admin-browserify instead."

runserver:
	dev_appserver.py app --storage_path=../datastores/mplsart.search --datastore_path=../datastores/mplsart.datastore --port=2000

admin-dev:
	# Builds the Phase 2 client

