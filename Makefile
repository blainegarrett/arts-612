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

client-dev:
	# Builds the Phase 2 client 
	@echo "Firing up jsx watch tools. Be sure to run the dev server in another shell."
	jsx --watch static/js/react/src/ static/js/react/build/

admin-dev:
	# Builds the Phase 2 client 
	@echo "Firing up jsx watch tools. Be sure to run the dev server in another shell."
	jsx --watch static/admin/js/react/src/ static/admin/js/react/build/
