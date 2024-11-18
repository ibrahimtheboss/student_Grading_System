import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from './api';

const SubjectsTab = () => {
  const [subjects, setSubjects] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ subjectName: '' });
  const [editingSubject, setEditingSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await axios.get('/subjects');
    setSubjects(res.data);
  };

  const handleAddSubject = async () => {
    if (!newSubject.subjectName) return;
    const subjectKey = crypto.randomUUID();

    const res = await axios.post('/subjects', { ...newSubject, subjectKey });
    setSubjects([...subjects, res.data]);
    setIsDialogOpen(false);
    // Reset form data after saving
    setNewSubject({ subjectName: '' });
  };

  const handleEditSubject = async () => {
    if (!editingSubject.subjectName) return;

    await axios.put(`/subjects/${editingSubject.subjectKey}`, editingSubject);
    setSubjects(
      subjects.map((subject) =>
        subject.subjectKey === editingSubject.subjectKey ? editingSubject : subject
      )
    );
    setIsEditDialogOpen(false);
    setEditingSubject(null); // Reset editing subject
  };

  const columns = [
    { field: 'subjectName', headerName: 'Subject Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            onClick={() => {
              setEditingSubject(params.row);
              setIsEditDialogOpen(true);
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsDialogOpen(true)}
        style={{ marginBottom: '16px' }}
      >
        Add Subject
      </Button>
      <Box style={{ height: 400, width: '100%' }}>
        <DataGrid rows={subjects} columns={columns} pageSize={5} getRowId={(row) => row.subjectKey} />
      </Box>

      {/* Add Subject Dialog */}
      <Dialog open={isDialogOpen} onClose={() => { setIsDialogOpen(false); setNewSubject({ subjectName: '' }); }}>
        <DialogTitle>Add Subject</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Name"
            fullWidth
            value={newSubject.subjectName}
            onChange={(e) => setNewSubject({ ...newSubject, subjectName: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddSubject} color="primary">
            Save
          </Button>
          <Button
            onClick={() => { setIsDialogOpen(false); setNewSubject({ subjectName: '' }); }}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => { setIsEditDialogOpen(false); setEditingSubject(null); }}>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Name"
            fullWidth
            value={editingSubject?.subjectName || ''}
            onChange={(e) =>
              setEditingSubject({ ...editingSubject, subjectName: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSubject} color="primary">
            Save
          </Button>
          <Button
            onClick={() => { setIsEditDialogOpen(false); setEditingSubject(null); }}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectsTab;
