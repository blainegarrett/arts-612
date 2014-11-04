
import logging
import os
import sys

# Must set this env var before importing any part of Django
# 'project' is the name of the project created with django-admin.py


def main():
    from subprocess import call
    import sys, getopt

    cmd_args = ['nosetests', "-vs", "--without-sandbox", "--nologcapture", "--with-gae", "--verbosity=3", "--with-yanc", "--with-coverage"]

    #cmd_args.extend(['--with-coverage', '--cover-html'])
    #"--with-coverage", "--cover-html"
    #cmd_args.append("--gae-datastore=.test_datastore")

    args = sys.argv
    args_count = len(args)
    
    if args_count > 1:
        tests = args[1]

        tests = "--tests=%s" % tests
        cmd_args.append(tests)
        
    #raise Exception(sys.argv[1:])

    #sys.path.append(os.path.dirname(os.path.realpath(__file__)) + '/lib') # Loads local libs
    #sys.path.append(os.path.join(os.path.dirname(__file__), 'merkabah/lib')) # Loads merkabah libs
    #os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

    # nosetests -sv --with-gae
    
    call(cmd_args)


if __name__ == '__main__':
    import unittest
    main()
    #unittest.main()