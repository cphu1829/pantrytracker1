'use client'
import * as React from 'react';
import { Box, Typography, Button, TextField, Dialog, Container } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbarContainer, useGridApiRef } from '@mui/x-data-grid';
// import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { randomId } from '@mui/x-data-grid-generator';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { firestore } from '@/firebase';
import { collection, getDocs, query, getDoc, updateDoc, setDoc, doc, deleteDoc } from "firebase/firestore";
import { useState, useEffect, useRef, updateInventory } from "react";
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';





export default function Home() {
  // useEffect(() => {
  //   const update = async () => {
  //     const items = collection(firestore, 'pantry')
  //     const docs = await getDoc(items)
  //     console.log(docs)
  //   }
  //   update()
  // }, [])
  const columns = [
    { field: 'item', headerName: 'Item Name', width: 200, editable: true },
    { field: 'quantity', headerName: 'Quantity', width: 140, type: 'number', editable: true, min: 0, },
    { field: 'actions', headerName: 'Actions', width: 75, cellClassName: 'actions', type: 'actions', 
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={params.id}
            icon={<DeleteIcon />}
            label="Delete"
            color="inherit"
            onClick={handleDeleteClick(id)}
          />,
        ];
      }
  
    }
    // { field: 'price', headerName: 'Price', width: 130, type: 'number', editable: true },
  ];
  
  const initialRows = [
    // { id: 1, item: 'Tomato', quantity: 3, price: 45},
    // { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  
  ];
  const [rows, setRows] = useState(initialRows);
  const [popupOpen, setOpen] = React.useState(false)
  const [inventory, setInventory] = useState([])
  const hasInitialized = useRef(false);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#3094bc',
        ligt: '#eeb09a',
        dark: '#3094bc',
      },
      secondary: {
        main: '#bc5830',
        light: '#87cfe1'
      }
    },
  });

  
  const handleDeleteClick = (id) => () => {
    const currRow = rows.find((row) => row.id === id)
    updateItem(currRow.item, 0, false)
    setRows(rows.filter((rows) => rows.id !== id))
  }
  
  const updateInventory = async () => {
    console.log("test")
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    await setInventory(inventoryList)
    console.table(inventoryList)
    //for loop
    inventoryList.forEach((item) => {
      if (rows.some(rows => rows.item === item.name)) {
        console.log("shouldnt be added")
      }
      else {
        const temp = randomId()
        setRows((prevRows) => [...prevRows, { id: temp, item: item.name, quantity: item.quantity, price: item.price}])
      }
    })
  }

  const updateItem = async (item, count, addBool) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await(getDoc(docRef))
    count = parseInt(count)
    if (addBool == true) {
      const objIndex = rows.findIndex(rows => rows.item == item);
      if (objIndex != -1) {
          rows[objIndex].quantity += count
          setRows((prevRows) => [...prevRows])
          count += docSnap.data().quantity

      }
    }

    if (docSnap.exists()) {
      if (count <= 0) {
        setRows(rows.filter((rows) => rows.item !== item))
        await deleteDoc(docRef)
      }
      else {
        await updateDoc(docRef, {quantity: count})
      }
    }
    else {
      await setDoc(docRef, {quantity: count})
    }
    await updateInventory()
  }

  const processRowUpdate = async (newRow, oldRow) => {
    if (newRow.item != oldRow.item) {
      const docRef = doc(collection(firestore, 'pantry'), oldRow.item)
      // const docSnap = await(getDoc(docRef))
      deleteDoc(docRef)
    }
    updateItem(newRow.item, newRow.quantity, false)
    return newRow
  }

  
  const updatePantry = () => {
    console.log("inside updatePantry()")
    console.table(rows)
    inventoryList.forEach((item) => {
      if (rows.some((row) => row.name === item.name)) {
        
      }
      else {
        const temp = randomId()
        setRows((prevRows) => [...prevRows, { id: temp, item: item.name, quantity: item.quantity, price: item.price}])
      }
    })
  }
  
  function EditToolbar(props) {
    const { setRows } = props;
    const handleClick = () => {
      const temp = randomId()
      setRows((prevRows) => [...prevRows, { id: temp, item: "", quantity: "", price: ""}]);
      
    }
    
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Add Item
        </Button>
      </GridToolbarContainer>
    );
  }
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  
  useEffect(() => {
    if (!hasInitialized.current) {
      updateInventory()

    }
    hasInitialized.current = true

  }, [])



  return (
    <ThemeProvider theme = {darkTheme} >
      <CssBaseline />
    
    <div style={{ height: "75%", width: '100%' }}>
    <Box
      sx ={{
        backgroundColor: "primary.main",
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      
    >
      <Typography
        variant ="h3"
        align='center'
        sx={{
          p:1
        }}
      > Pantry Tracker

    </Typography>
    </Box>
    <Dialog 
      open={popupOpen}
      onClose={handleClose}
      fullWidth = {250}
      maxWidth = {250}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const name = formJson.name;
          const quantity = parseInt(formJson.quantity);
          const temp = randomId()
          console.log(name, quantity);
          updateItem(name, quantity, true)
          handleClose();
        },
      }}
    >
      <DialogTitle>Add Item</DialogTitle>
      <DialogContent>Please add Name and Quantity</DialogContent>
      <TextField required name = "name" label = "Name"></TextField>
      <TextField required name = "quantity" type = "number" label = "Quantity"></TextField>

      <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
      </DialogActions>
    </Dialog>

    <Container
      sx={{p:1}}
    >
      <DataGrid
        sx ={{
          m:4,
          border:2,
          borderColor: 'light blue'
        }}
        rows={rows}
        columns = {columns}
        editMode="row"
        processRowUpdate={processRowUpdate}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}

        slots={{
          toolbar: EditToolbar,
        }}

        slotProps={{
          toolbar: { setRows },
        }}

        pageSizeOptions={[5, 10]}
      />
    </Container>
    </div>
    </ThemeProvider>
  );
}
