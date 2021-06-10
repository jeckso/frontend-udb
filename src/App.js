import React, {useState, useEffect} from 'react';
import './App.css';
import {forwardRef} from 'react';
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import {CalendarToday} from "@material-ui/icons";

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

const api = axios.create({
    baseURL: `http://localhost:1337/`
    //baseURL: `https://udb-khpi.herokuapp.com`
})


function validateEmail(email) {
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}

function App() {

    var parentColumns = [

        {title: "id", field: "id", hidden: true},
        {title: "Прізвище", field: "FirstName"},
        {title: "Ім'я", field: "LastName"},
        {title: "Побатькові", field: "MiddleName"},

        {
            title: "Телефони", render: rowData => {
                var result = ""
                rowData.phone_numbers.slice().reverse().forEach(number => result += number.PhoneNumber.toString() + "\n")
                return result
            }
        },
        {
            title: "Адреси", render: rowData => {
                var result = ""
                rowData.addresses.slice().reverse().forEach(number => result += number.Address + "\n")
                return result
            }
        },
        {
            title: "Emails", render: rowData => {
                var result = ""
                rowData.emails.slice().reverse().forEach(number => result += number.Email + "\n")
                return result
            }
        },
    ]

    var columns = [
        {title: "id", field: "id", hidden: true},
        // {title: "Avatar", render: rowData => <Avatar maxInitials={1} size={40} round={true} name={rowData === undefined ? " " : rowData.first_name} />  },
        {title: "Прізвище", field: "FirstName"},
        {title: "Ім'я", field: "LastName"},
        {title: "Побатькові", field: "MiddleName"},
        {
            title: "Форма навчання", field: "IsContract",
            lookup: {true: 'Контракт', false: 'Бюджет'}
        },
        {
            title: "Група",
            render: rowData => rowData.group.GroupName,
            customFilterAndSearch: (term, rowData) => rowData.group.GroupName.includes(term)
        },
        {
            title: "Староста", field: "IsHead",
            lookup: {true: 'Так', false: 'Ні'}
        },
        {
            title: "Стипендія", field: "Scholarship",
            lookup: {true: 'Так', false: 'Ні'}
        },
        // render: rowData => rowData.Scholarship === true ? "Так" : "Ні"},
        {
            title: "Телефон", render: rowData => {
                var result = ""
                rowData.phone_numbers.slice().reverse().forEach(number => result += number.PhoneNumber.toString() + "\n")
                return result
            },
            // customFilterAndSearch: (term, rowData) =>  rowData.phone_numbers.slice().reverse().forEach(number => console.log(number.PhoneNumber.includes(term)) )
        },
        {
            title: "Emails", render: rowData => {
                var result = ""
                rowData.emails.slice().reverse().forEach(email => result += email.Email.toString() + "\n")
                return result
            }
        }
        // {title: "email", field: "emails"}
    ]
    const [data, setData] = useState([]); //table data
    const [parentData, setParent] = useState([]); //parent data

    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = () => {
        const formData = new FormData();

        formData.append('file', selectedFile);

        fetch(
            'http://localhost:1337/content-export-import/import',
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        api.get("/students")
            .then(res => {
                setData(res.data)
            })
            .catch(error => {
                console.log("Error")
            })
    }, [])

    useEffect(() => {
        api.get('/parents')
            .then(res => {
                setParent(res.data)

            })
            .catch(error => {
                console.log("Error")
            })
    }, [])

    const handleRowUpdate = (newData, oldData, resolve) => {
        //validation
        let errorList = []
        if (newData.first_name === "") {
            errorList.push("Please enter first name")
        }
        if (newData.last_name === "") {
            errorList.push("Please enter last name")
        }
        // if (newData.email === "" || validateEmail(newData.email) === false) {
        //     errorList.push("Please enter a valid email")
        // }

        if (errorList.length < 1) {
            api.put("/students/" + newData.id, newData)
                .then(res => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve()
                    setIserror(false)
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Update failed! Server error"])
                    setIserror(true)
                    resolve()

                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()

        }

    }

    const handleRowAdd = (newData, resolve) => {
        //validation
        let errorList = []
        if (newData.first_name === undefined) {
            errorList.push("Please enter first name")
        }
        if (newData.last_name === undefined) {
            errorList.push("Please enter last name")
        }
        if (newData.email === undefined || validateEmail(newData.email) === false) {
            errorList.push("Please enter a valid email")
        }

        if (errorList.length < 1) { //no error
            api.post("/students", newData)
                .then(res => {
                    let dataToAdd = [...data];
                    dataToAdd.push(newData);
                    setData(dataToAdd);
                    resolve()
                    setErrorMessages([])
                    setIserror(false)
                })
                .catch(error => {
                    setErrorMessages(["Cannot add data. Server error!"])
                    setIserror(true)
                    resolve()
                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }


    }

    const handleRowDelete = (oldData, resolve) => {

        api.delete("/users/" + oldData.id)
            .then(res => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve()
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error"])
                setIserror(true)
                resolve()
            })
    }


    return (
        <div className="App">

            <Grid container spacing={1}>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                    <div>
                        {iserror &&
                        <Alert severity="error">
                            {errorMessages.map((msg, i) => {
                                return <div key={i}>{msg}</div>
                            })}
                        </Alert>
                        }
                    </div>
                    <MaterialTable
                        title="Інформація про студентів"
                        columns={columns}
                        data={data}
                        localization={{
                            toolbar: {
                                exportCSVName: 'Експорт основних данних',
                                exportPDFName: 'Експорт розширенний',
                                searchTooltip: 'Пошук',
                                searchPlaceholder: 'Пошук'
                            }
                        }}
                        icons={tableIcons}
                        options={{
                            filtering: true,
                            exportButton: true,
                            exportFileName: Date,

                            exportPdf: (columns, data) => {
                                console.log(data[0].group.GroupName)
                                var fileName = data[0].group.GroupName+"-"+Date.now()
                                const ws = XLSX.utils.json_to_sheet(data);
                                const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
                                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                                const dataDone = new Blob([excelBuffer], {type: fileType});
                                FileSaver.saveAs(dataDone, fileName + fileExtension);
                                //alert('You should develop a code to export ' + data[0] + ' rows');
                            }

                        }}
                        detailPanel={[
                            {
                                tooltip: 'Інформація про батьків',
                                render: rowData => {
                                    return (
                                        <MaterialTable
                                            title="Інформація про батьків"
                                            columns={parentColumns}
                                            data={parentData.filter(parentItem => rowData.parents.some(item => item.id === parentItem.id))}

                                            icons={tableIcons}
                                        />
                                    )
                                }
                            }]}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    handleRowUpdate(newData, oldData, resolve);

                                }),
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    handleRowAdd(newData, resolve)
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    handleRowDelete(oldData, resolve)
                                })
                        }}
                    />
                </Grid>
                <Grid item xs={12}></Grid>
            </Grid>

            <div>
                <input type="file" name="file" onChange={changeHandler} />
                {isFilePicked ? (
                    <div>
                        <p>Назва файлу: {selectedFile.name}</p>
                        <p>Тип Файлу: {selectedFile.type}</p>
                        <p>Розмір: {selectedFile.size}</p>
                        <p>
                            Дата останніх змін:{' '}
                            {selectedFile.lastModifiedDate.toLocaleDateString()}
                        </p>
                    </div>
                ) : (
                    <p>Виберіть файл для імпорту</p>
                )}
                <div>
                    <button onClick={handleSubmission}>Імпортувати</button>
                </div>
            </div>
        </div>

    );
}

export default App;