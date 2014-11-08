PYTHON_SITE_PACKAGES_PATH := \
	$(shell python -c "from distutils.sysconfig import get_python_lib; print(get_python_lib())")

help:
	@echo "TODO: Write the install help"


clean-pyc:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +

install:
	pip install -r requirements_dev.txt
	linkenv $(PYTHON_SITE_PACKAGES_PATH) external

unit:
	nosetests --cover-package=modules,rest -vs --without-sandbox --with-gae --with-yanc --with-xunit --xunit-file=unit_results.xml --nologcapture --verbosity=3 --cover-html --logging-level=ERROR --with-coverage --with-yanc tests
