import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Add,
  Edit,
  Delete,
  PregnantWoman,
  ChildCare,
  Home,
  MicNone as Mic,
} from '@mui/icons-material';

// Mock data for demonstration
const initialReminders = {
  anc: [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      type: 'ANC',
      visitNumber: 1,
      date: new Date('2025-05-10T10:00'),
      notes: 'First trimester checkup',
      status: 'upcoming',
    },
    {
      id: 2,
      patientName: 'Mary Smith',
      type: 'ANC',
      visitNumber: 3,
      date: new Date('2025-05-15T14:30'),
      notes: 'Ultrasound scheduled',
      status: 'upcoming',
    },
  ],
  pnc: [
    {
      id: 3,
      patientName: 'Emma Davis',
      type: 'PNC',
      visitNumber: 1,
      date: new Date('2025-05-07T11:00'),
      notes: 'First week checkup',
      status: 'upcoming',
    },
  ],
  chw: [
    {
      id: 4,
      householdName: 'Williams Family',
      location: 'Block 4, House 23',
      date: new Date('2025-05-08T09:00'),
      purpose: 'Regular checkup',
      status: 'pending',
    },
  ],
};

const RemindersPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reminders, setReminders] = useState(initialReminders);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedReminder, setSelectedReminder] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddReminder = (type) => {
    setDialogType(type);
    setSelectedReminder(null);
    setOpenDialog(true);
  };

  const handleEditReminder = (reminder, type) => {
    setDialogType(type);
    setSelectedReminder(reminder);
    setOpenDialog(true);
  };

  const handleDeleteReminder = (id, type) => {
    setReminders((prev) => ({
      ...prev,
      [type]: prev[type].filter((reminder) => reminder.id !== id),
    }));
  };

  const handleSaveReminder = (reminderData) => {
    const newId = Math.max(...Object.values(reminders).flat().map((r) => r.id)) + 1;
    
    setReminders((prev) => {
      const updatedReminders = { ...prev };
      if (selectedReminder) {
        updatedReminders[dialogType] = prev[dialogType].map((r) =>
          r.id === selectedReminder.id ? { ...reminderData, id: r.id } : r
        );
      } else {
        updatedReminders[dialogType] = [
          ...prev[dialogType],
          { ...reminderData, id: newId },
        ];
      }
      return updatedReminders;
    });
    
    setOpenDialog(false);
  };

  const ReminderDialog = () => {
    const [formData, setFormData] = useState(
      selectedReminder || {
        patientName: '',
        householdName: '',
        location: '',
        date: new Date(),
        notes: '',
        visitNumber: 1,
        purpose: '',
        status: 'upcoming',
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveReminder(formData);
    };

    return (
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedReminder ? 'Edit' : 'Add'} {dialogType.toUpperCase()} Reminder
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {dialogType !== 'chw' && (
                <TextField
                  label="Patient Name"
                  value={formData.patientName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                  fullWidth
                  required
                />
              )}

              {dialogType === 'chw' && (
                <>
                  <TextField
                    label="Household Name"
                    value={formData.householdName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, householdName: e.target.value })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="Location"
                    value={formData.location || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </>
              )}

              {(dialogType === 'anc' || dialogType === 'pnc') && (
                <TextField
                  label="Visit Number"
                  type="number"
                  value={formData.visitNumber || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visitNumber: parseInt(e.target.value, 10),
                    })
                  }
                  fullWidth
                  required
                />
              )}

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date & Time"
                  value={formData.date}
                  onChange={(newValue) =>
                    setFormData({ ...formData, date: newValue })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>

              {dialogType === 'chw' ? (
                <TextField
                  label="Visit Purpose"
                  value={formData.purpose || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={2}
                  required
                />
              ) : (
                <TextField
                  label="Notes"
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={2}
                />
              )}

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || 'upcoming'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  const renderReminderList = (type) => {
    const list = reminders[type] || [];
    return (
      <List>
        {list.map((reminder) => (
          <Paper
            key={reminder.id}
            elevation={1}
            sx={{ mb: 2, overflow: 'hidden' }}
          >
            <ListItem
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditReminder(reminder, type)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteReminder(reminder.id, type)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">
                      {reminder.patientName || reminder.householdName}
                    </Typography>
                    <Chip
                      label={reminder.status}
                      color={
                        reminder.status === 'completed'
                          ? 'success'
                          : reminder.status === 'cancelled'
                          ? 'error'
                          : 'primary'
                      }
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {type !== 'chw'
                        ? `Visit ${reminder.visitNumber} - ${reminder.notes}`
                        : `Location: ${reminder.location}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reminder.date.toLocaleString()}
                    </Typography>
                    {type === 'chw' && reminder.purpose && (
                      <Typography variant="body2" color="text.secondary">
                        Purpose: {reminder.purpose}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Health Visit Reminders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your ANC, PNC, and Community Health Worker visit schedules
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            icon={<PregnantWoman />}
            label="ANC"
            iconPosition="start"
          />
          <Tab
            icon={<ChildCare />}
            label="PNC"
            iconPosition="start"
          />
          <Tab
            icon={<Home />}
            label="CHW Visits"
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            handleAddReminder(activeTab === 0 ? 'anc' : activeTab === 1 ? 'pnc' : 'chw')
          }
        >
          Add New Reminder
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && renderReminderList('anc')}
        {activeTab === 1 && renderReminderList('pnc')}
        {activeTab === 2 && renderReminderList('chw')}
      </Box>

      {openDialog && <ReminderDialog />}
    </Container>
  );
};

export default RemindersPage;
