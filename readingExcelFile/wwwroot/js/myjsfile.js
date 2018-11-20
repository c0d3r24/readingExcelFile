
document.getElementById('saveDataBtn').addEventListener('click', saveData);
document.getElementById('priceSheet').addEventListener('click', showData);


var tableData;
function showData(e){
    console.log(e.target.id);
    createHandsonSheet(tableData,'#hot2');
}
var handsonTable =[];
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
                tableData = JSON.parse(data);
                createHandsonSheet(tableData,"#hot");
                console.log(handsonTable);

            }
        });


}

function saveData() {
  var htContents = JSON.stringify({data: handsonTable.getData()})
console.log(htContents);
    $.ajax({

        url: '/ExcelToHandson/SaveData',
        data: htContents,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: "POST",

        success: function (data) {
            console.log(data);
        }
    });
}


     function createHandsonSheet(sheetData,id) {

                    var hotElement = document.querySelector(id);

                    $(hotElement).empty();
                    //var hotElementContainer = hotElement.parentNode;
                    var dataObject = [];
                    sheetData.columns.forEach(function(item){
                        dataObject.push({ data: item});
                    });
                    console.log(sheetData);
                    var hotSettings = {
                                        data: sheetData.data,
                                        columns: dataObject,
                                        afterChange: function (change, source) {
                                            console.log('I am changing something');
                                        },
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
                     
                     handsonTable.push(new Handsontable(hotElement, hotSettings)); 

                }

