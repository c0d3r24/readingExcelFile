

function fileupload(filename){

    var inputfile = document.getElementById(filename);
    var files = inputfile.files;
    var fdata = new FormData();
    for (var i= 0 ; i != files.length; i++){
        fdata.append("files", files[i]);
    }
    $.ajax({

            url: '/ExcelToHandson',
            data: fdata,
            processData: false,
            contentType: false,
            type:"POST",
            success: function(data){
                data = JSON.parse(data);
                createHandsonSheet(data)
            }
        });


}


     function createHandsonSheet(sheetData) {

                    var hotElement = document.querySelector('#hot');
                    $(hotElement).empty();
                    var hotElementContainer = hotElement.parentNode;
                    var dataObject = [];
                    sheetData.columns.forEach(function(item){
                        dataObject.push({ data: item});
                    });

                    var hotSettings = {
                                        data: sheetData.data,
                                        columns: dataObject,
                                        stretchH: 'all',
                                          width: 1200,
                                          autoWrapRow: true,
                                          height: 500,
                                          maxRows: 200,
                                          manualRowResize: true,
                                          manualColumnResize: true,
                                          rowHeaders: true,
                                        colHeaders: sheetData.columns
                                        };

                        var hot = new Handsontable(hotElement, hotSettings);        
                }

