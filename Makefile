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
	nosetests --cover-package=modules,rest -vs --without-sandbox --with-gae --with-yanc --with-xunit --xunit-file=unit_results.xml --nologcapture --verbosity=3 --cover-html --logging-level=ERROR --with-coverage --with-yanc tests

client-dev:
	# Builds the Phase 2 client 
	@echo "Run gulp admin-browserify instead."

admin-dev:
	# Builds the Phase 2 client 

