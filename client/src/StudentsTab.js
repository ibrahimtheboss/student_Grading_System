import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  FormHelperText,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from './api';

const StudentsTab = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: '',
    subjectKey: '',
    grade: '',
    remarks: '', // Added remarks field
  });
  const [errors, setErrors] = useState({
    studentName: '',
    subjectKey: '',
    grade: '',
  });

  const [editingStudent, setEditingStudent] = useState(null);

  
  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, filter, searchTerm, applyFilters]); // Add applyFilters to dependencies
  useEffect(() => {
    if (!isDialogOpen) {
      // Reset errors and clear form data when dialog is closed
      setErrors({
        studentName: '',
        subjectKey: '',
        grade: '',
      });
      setNewStudent({
        studentName: '',
        subjectKey: '',
        grade: '',
        remarks: '', // Add other fields if necessary
      });
      setEditingStudent(null);
    }
  }, [isDialogOpen]);
  

  const fetchStudents = async () => {
    const res = await axios.get('/students');
    setStudents(res.data);
  };

  const fetchSubjects = async () => {
    const res = await axios.get('/subjects');
    setSubjects(res.data.filter((subject) => subject.active !== false)); // Exclude inactive subjects
  };

  const applyFilters = () => {
    let filtered = students;

    if (filter === 'pass') {
      filtered = students.filter((student) => student.remarks === 'PASS');
    } else if (filter === 'fail') {
      filtered = students.filter((student) => student.remarks === 'FAIL');
    }

    if (searchTerm) {
      filtered = filtered.filter((student) =>
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const validateForm = () => {
    const tempErrors = {
      studentName: newStudent.studentName ? '' : 'Student Name is required',
      subjectKey: newStudent.subjectKey ? '' : 'Subject is required',
      grade: newStudent.grade ? '' : 'Grade is required',
    };

    setErrors(tempErrors);

    // Return true if no errors
    return Object.values(tempErrors).every((error) => !error);
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return;

  const grade = parseInt(newStudent.grade, 10);
  const remarks = grade >= 75 ? 'PASS' : 'FAIL';

  if (editingStudent) {
    // Update existing student
    const res = await axios.put(`/students/${editingStudent.studentKey}`, {
      ...newStudent,
      grade,
      remarks,
    });
    setStudents(students.map((student) => (student.studentKey === res.data.studentKey ? res.data : student)));
  } else {
    // Add new student
    const studentKey = crypto.randomUUID();
    const res = await axios.post('/students', {
      ...newStudent,
      studentKey,
      grade,
      remarks,
    });
    setStudents([...students, res.data]);
  }

  setIsDialogOpen(false);
  setNewStudent({ studentName: '', subjectKey: '', grade: '', remarks: '' }); // Clear the form
  setEditingStudent(null); // Reset editing mode
  };

  const handleDeleteStudent = async (studentKey) => {
    await axios.delete(`/students/${studentKey}`);
    setStudents(students.filter((student) => student.studentKey !== studentKey));
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      studentName: student.studentName,
      subjectKey: student.subjectKey,
      grade: student.grade.toString(),
      remarks: student.remarks,
    });
    setIsDialogOpen(true);
  };
  

  const columns = [
    { field: 'studentName', headerName: 'Student Name', flex: 1 },
    {
      field: 'subjectKey',
      headerName: 'Subject',
      flex: 1,
      valueGetter: (params) =>
        subjects.find((subject) => subject.subjectKey === params)?.subjectName || '',
    },
    { field: 'grade', headerName: 'Grade', flex: 0.5 },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 0.5,
      renderCell: (params) => {
        const remarks = params.value;
        const color = remarks === 'PASS' ? 'green' : remarks === 'FAIL' ? 'red' : 'black';
        return <span style={{ color }}>{remarks}</span>;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button color="primary" onClick={() => handleEditStudent(params.row)}>
            Edit
          </Button>
          <Button color="secondary" onClick={() => handleDeleteStudent(params.row.studentKey)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <FormControl fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter"
            >
              <MenuItem value="all">All Students</MenuItem>
              <MenuItem value="pass">PASS</MenuItem>
              <MenuItem value="fail">FAIL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)}>
            Add Student
          </Button>
        </Grid>
      </Grid>

      <Box mt={3} style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredStudents}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.studentKey}
          noRowsOverlay={<div>No data available</div>}
        />
      </Box>

      {/* Add Student Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
      <DialogTitle>{editingStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Student Name"
            fullWidth
            value={newStudent.studentName}
            onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
            error={!!errors.studentName}
            helperText={errors.studentName}
          />
          <FormControl fullWidth margin="normal" error={!!errors.subjectKey}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={newStudent.subjectKey}
              onChange={(e) => setNewStudent({ ...newStudent, subjectKey: e.target.value })}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.subjectKey} value={subject.subjectKey}>
                  {subject.subjectName}
                </MenuItem>
              ))}
            </Select>
            {errors.subjectKey && <FormHelperText>{errors.subjectKey}</FormHelperText>}
          </FormControl>
          <TextField
            label="Grade"
            type="number"
            fullWidth
            margin='normal'
            value={newStudent.grade}
            onChange={(e) => {
              const grade = e.target.value;
              setNewStudent({
                ...newStudent,
                grade,
                remarks: grade >= 75 ? 'PASS' : grade ? 'FAIL' : '', // Auto-set remarks based on grade
              });
            }}
            error={!!errors.grade}
            helperText={errors.grade}
          />
          <TextField
            label="Remarks"
            fullWidth
            value={newStudent.remarks}
            onChange={(e) => setNewStudent({ ...newStudent, remarks: e.target.value })}
            disabled // Remarks is automatically set based on grade
            style={{
              color: newStudent.remarks === 'PASS' ? 'green' : newStudent.remarks === 'FAIL' ? 'red' : 'black',
            }}
          />
        </DialogContent>
<DialogActions>
  <Button onClick={handleAddStudent} color="primary" disabled={!!errors.studentName || !!errors.subjectKey || !!errors.grade}>
    {editingStudent ? 'Save Changes' : 'Save'}
  </Button>
  <Button onClick={() => setIsDialogOpen(false)} color="secondary">
    Cancel
  </Button>
</DialogActions>

      </Dialog>
    </Box>
  );
};

export default StudentsTab;
