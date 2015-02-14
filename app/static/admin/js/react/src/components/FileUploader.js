var React = require('react');
var FileStore =  require('../stores/FileStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');

function getFileListState() {
    return FileStore.getRaw(); // {jive: [{id: file_data }]}
}

var callback_url = '';

var File = React.createClass({
    
    signalFileUpdated: function (payload) {
        // payload is a list of Files to update
        //alert('update the store???!?!?!');
        return AppDispatcher.handleSetMeta({signal: 'UPDATEFILES', payload: payload})
    },

    readFile: function () {
        // Read in the file data of the selected file
        // Note: The component is already initialized at this point and the callback will update it
        var fileObj, reader;
        
        fileObj = this.state.fileObj;

        // TODO: Check allowed fileTypes...
    	// Ignore any non image files for now...
    	//if (!fileObj.type.match('image.*')) {
    	//	return;
    	//}


    	//Generate a random temp id so we can reconnect things later
    	//fileObj.temp_id = Math.floor((Math.random() * 100000000) + 1);

    	// Output a prelim image placeholder while the file system reads the image from disk
    	//var new_thumb = $('<a href="#" data-temp_id="' + fileObj.temp_id + '"><div class="upload-indicator" style="height:100%;top:0"></div></a>');
    	//var thumblist = $('#thumbs');
    	//thumblist.append(new_thumb);

        //console.log(fileObj); 

    	// Initialize the FileReader and set callback for once file is read in
    	reader = new FileReader(); 
    	reader.onload = (this.file_read_handler)(fileObj);
    	reader.readAsDataURL(fileObj);
    },

        get_upload_url_for_file: function(fileObj) {
            // Fetch the upload url from the server
            
            //alert('lets get the upload url...');

            //console.log(this.state.callback_url);
            console.log(settings.domain);

        	var resource_url = 'http://' + settings.domain  + '/api/files/upload_url';
            var restData = {"callback_url": callback_url};

            $.ajax({
                url: resource_url,
                type: 'post',
                dataType: 'json',
                data: JSON.stringify(restData),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success:  function(data) {
                    //alert('win');
                    //console.log(data.results);
                    //console.log(data.results['upload_url'])
                    //console.log(this);
                    this.start_upload(fileObj, data.results['upload_url']);

                }.bind(this),

                error: function(xhr, status, err) {
                    error_body = JSON.parse(xhr.responseText);
                    
                    alert('Failed to get the upload url...');

                    this.setState({errors: error_body.messages}); //messages is always a list
                    console.error(status, err.toString());
                    console.log(this);

                }.bind(this) 
            });


        },

        file_read_handler: function (fileObj) {
            // Callback For When File is read in from local file system


        	return function(event) {
                // Callback For When File is read in from local file system

                var reader = event.target; // type FileReader
        		var fileBlob = reader.result; // The value is data:<mime>;base64,<binary data>

                var xmime = fileObj.type;
                var xname = fileObj.name;
                var xsize = fileObj.size;


                //console.log([xmime, xname, xsize]);
                //console.log(fileBlob);


        		// Set the background image to the temp place holder image
        		//var thumb = $('#thumbs a[data-temp_id="' + fileObj.temp_id + '"]');
        		//reader.readAsDataURL(fileObj);

                //alert('jive');

        		// Tell the FileStore we have updates - specifically a new path for image
        		this.signalFileUpdated([{
        		        store_id: this.state.store_id,
        		        path: fileBlob,
        		        is_loading: true,
        		        percent_loaded: 0,
        		        fileObj: null
        		    }]);
 
        		// Fire off a call to fetch an upload url for google cloud storage
        		//console.log(this);
        		this.get_upload_url_for_file(fileObj);
        	}.bind(this)
        },

        start_upload: function (fileObj, upload_url) {
            //console.log('In Start Upload');
            //console.log(this);
            //console.log(fileObj);
            
            // This is indirectly a REST resource call. 

            var upload_form_key = 'the_file'; // TODO: Make this a constant? perhaps part of uploaded file payload?

        	var formData = new FormData();
        	formData.append(upload_form_key, fileObj, fileObj.name);
        	//formData.append('upload_form_key', upload_form_key);

            // Make the Call to the upload url
            rc = this;

        	$.ajax({
        	        url: upload_url,
        	        type: 'POST',
        	        data: formData,
        	        cache: false,
        	        dataType: 'json',
        	        processData: false, // Don't process the files
        	        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        			xhr: function()
        			  {
        			    var xhr = new window.XMLHttpRequest();
        			    //Upload progress
        			    xhr.upload.addEventListener("progress", function(evt){
        			      if (evt.lengthComputable) {

        			        var percentComplete = evt.loaded / evt.total;
        			        //Do something with upload progress
        					percentComplete = Math.floor(percentComplete * 100);
        					
        					
                    		// Tell the FileStore we have updates - specifically a new path for image
                    		rc.signalFileUpdated([{
                    		        store_id: rc.state.store_id,
                    		        percent_loaded: percentComplete
                    		    }]);

                            //console.log(percentComplete);
        					//var indicator = $('#thumbs a[data-temp_id="' + fileObj.temp_id + '"] .upload-indicator');
        					//indicator.css('top', percentComplete + '%');
        					//indicator.css('height', (100 - percentComplete) + '%');
        			      }
        			    }, false);
        			    return xhr;
        			},
        	        success: function(data, textStatus, jqXHR) {
        	            alert('uploaded??!?!??!?!');
        	        },
        	        error: function(data, textStatus, errorThrown) {
        	            alert('errored???!?!??!?!');
        	        }
        	    });

        },
    
    componentWillReceiveProps: function (new_props){
        // Update the state with the new props when the element is re-rendered

        this.setState(new_props)
    },

    componentDidMount: function() {
        // If this is a file upload, we need to trigger the reading of the local file

        if (this.state.fileObj) { // D
            this.readFile();            
        }
    },

    getInitialState: function() {

        console.log('FILE.getInitialState - Setting State - props:');
        console.log(this.props);

        state =  {
            store_id: this.props.store_id,
            is_loading: this.props.is_loading || false,
            path: this.props.path || "http://placehold.it/100x100",
            percent_loaded: this.props.percent_loaded || 100,
            fileObj: this.props.fileObj
        }
        
        if (this.props.percent_loaded == undefined) {
            state.percent_loaded = 100;
        }
        else {
            state.percent_loaded = this.props.percent_loaded;
        }
        return state;
    },

    render: function () {
        //alert('render');
        console.log('File.render - state:');
        console.log(this.state);

        var style_data = {'backgroundImage': 'url(' + this.state.path + ')'}
        var loader_style = {'height': (100 - this.state.percent_loaded) + '%'}
        var loader_nodes = [];
        
        if (this.state.is_loading) {
            loader_nodes.push(<span className="loading-indicator" style={loader_style} data-store-id={this.state.store_id} data-percent-loaded={this.state.percent_loaded}></span>)
            loader_nodes.push(<span className="loading-indicator-percent">{this.state.percent_loaded}%</span>)
        }

        return  <div className="col-md-3">
            <a href="#" className="thumbnail" style={style_data} title="cheeseburger">
                {loader_nodes}
            </a>
        </div>
    }
    
    
});

var FileList = React.createClass({
    getInitialState: function() {
        var files = getFileListState();
        
        return {
            files: files
        };
    },

    componentDidMount: function() {
        // Subscribe to changes in the page meta
        FileStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        // Un-Subscribe to changes in the page meta
      FileStore.removeChangeListener(this._onChange);
    },
    _onChange : function () {
      this.setState(getFileListState());
    },
    render: function () {

        var rendered_files = [];
        
        console.log('FileList.render - logging state: ');
        console.log(this.state);

        for (var key in this.state.files.jive) {
            file = this.state.files.jive[key];
            console.log(file);
            rendered_files.push(<File key={key} store_id={file.store_id} path={file.path} is_loading={file.is_loading} fileObj={file.fileObj} ref={'file' + file.store_id} percent_loaded={file.percent_loaded} />);
        }
        
        return <div className="row">{rendered_files}</div>        
    }
});

var FileUploader = React.createClass({
    getInitialState: function () {
        callback_url = this.props.callback_url;

        return {
            callback_url: this.props.callback_url
        }
    },

    file_selection_handler: function (event) {
        var selected_files = event.target.files; // FileList object
        var rc = this;
        console.log(rc);
        
        for (var i = 0; i < selected_files.length; i++) {
            fileObj = selected_files[i];

    		// Ignore any non image files for now...
    		//if (!fileObj.type.match('image.*')) {
    		//	return;
    		//}

            result = this.signalFileAdded([{'path': '', is_loading: true, percent_loaded: 0, fileObj: fileObj}])


    		//Generate a random temp id so we can reconnect things later
    		//fileObj.temp_id = Math.floor((Math.random() * 100000000) + 1);

    		// Output a prelim image placeholder while the file system reads the image from disk
    		//var new_thumb = $('<a href="#" data-temp_id="' + fileObj.temp_id + '"><div class="upload-indicator" style="height:100%;top:0"></div></a>');
    	    //var thumblist = $('#thumbs');
    		//thumblist.append(new_thumb);

    	}
    },

    signalFileAdded: function (payload) {
        return AppDispatcher.handleSetMeta({signal: 'ADDFILES', payload: payload})
    },

    render: function() {

        // Add any files that are default ... this will be called from rest api...

        var data_from_rest_resource = [
            {'path': "http://placehold.it/300x150"},
            {'path': "http://placehold.it/300x300"}
        ];

        //this.signalFileAdded(data_from_rest_resource)

        return <div>
            <input id="files" onChange={this.file_selection_handler } name="files[]" multiple="true" type="file" />
            
            <FileList />
        
        </div>
    }
});

module.exports = FileUploader