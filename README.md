# XOvis

The objective of this project is to gain insights into how XOs are used in
Nepalese classrooms. In order to learn about XO usage, first data is collected
from their Journal backups on the schoolserver. Subsequently, the data is
processed and imported into a database and finally visualized using fancy
interactive charts. The application that implements the visualization of the
data is called XOvis, a Couch App built using [Kanso](htttp://kan.so)
framework. See dataflow.svg for a schematic representation of the entire
workflow.

## Prerequisites

- CouchDB 1.7
- Python 2.7
- Node.js 8

Install project dependencies for a Fedora system.

    yum install python-pip git couchdb nodejs npm


## Installation

* Create a couchdb database.

      curl -X PUT http://127.0.0.1:5984/xovis

  _Note: if you use a different database name, you'll need to set that in your
  `config.js`._

* Clone this repository in the destination of your choice.

      git clone https://github.com/andi-g/xovis.git
      cd xovis

* Install JavaScript dependencies by issuing the following command
  in the root directory of this repo.

      npm install

* Push the xovis couchapp into your database.

      ./node_modules/.bin/couchapp push xovis/app.js http://localhost:5984/xovis

  _Note: If you have already set up a couchdb admin user, please use the credentials._

      ./node_modules/.bin/couchapp push xovis/app.js http://username:password@localhost:5984/xovis

* Start the app.

      npm start

  Open your browser to [localhost:8000](http://localhost:8000).


### Load existing deployment data into the database

* Insert XO Journal backup data into the same database using a Python script

		pip install -r process_stats/requirements.txt
		./process_stats/process_journal_stats.py dbinsert xovis --deployment <deployment-name>
		
	*Note:*

	The script can also output statistical data to a file instead of inserting it
	into a database. To produce all statistical data from the Journal, one row per
	Journal record, call:
	
		process_journal_stats.py all
	
	To extract statistical data about the use of activities on the system, use:
	
		process_journal_stats.py activity
	
	To learn about all options of the script, see:
	
		process_journal_stats.py --help

* To manage Couch databases using a browser dashboard, go to

		http://localhost:5984/_utils

## Visualize

* Open up a browser and open the index.html file in this repo.

      open index.html

  or

      xdg-open index.html

**Enjoy the beautiful view!**

## Acknowledgments

`process_journal_stats.py` script is based on
[olpc-journal-processor](https://github.com/Leotis/olpc_journal_processor)
script Leotis' Buchanan and
[get-journal-stats](http://gitorious.paraguayeduca.org/get-journal-stats) by
Raul Gutierrez Segales.
