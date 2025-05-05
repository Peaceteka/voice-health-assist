import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  Search,
  FilterList,
  LocalHospital as Emergency,
  PregnantWoman,
  ChildCare,
  Home,
  MedicalServices,
  Info,
  Clear,
} from '@mui/icons-material';

// Mock data for demonstration
const initialActivities = [
  {
    id: 1,
    type: 'emergency',
    title: 'Emergency Report: Stroke Symptoms',
    description: 'Reported emergency case for patient showing stroke symptoms',
    timestamp: new Date('2025-05-05T12:30:00'),
    details: {
      location: '123 Main St',
      symptoms: ['Facial drooping', 'Arm weakness', 'Speech difficulties'],
      action: 'Emergency services contacted',
    },
    status: 'resolved',
  },
  {
    id: 2,
    type: 'anc',
    title: 'ANC Visit Scheduled',
    description: 'Scheduled 3rd trimester checkup for Sarah Johnson',
    timestamp: new Date('2025-05-05T10:15:00'),
    details: {
      patientName: 'Sarah Johnson',
      visitNumber: 3,
      scheduledDate: new Date('2025-05-10T09:00:00'),
    },
    status: 'scheduled',
  },
  {
    id: 3,
    type: 'pnc',
    title: 'PNC Follow-up Completed',
    description: 'Completed postnatal checkup for Emma Davis',
    timestamp: new Date('2025-05-05T09:00:00'),
    details: {
      patientName: 'Emma Davis',
      visitNumber: 2,
      notes: 'Mother and baby doing well',
    },
    status: 'completed',
  },
  {
    id: 4,
    type: 'chw',
    title: 'Household Visit Report',
    description: 'Completed routine health check for Williams family',
    timestamp: new Date('2025-05-04T14:30:00'),
    details: {
      household: 'Williams Family',
      location: 'Block 4, House 23',
      findings: 'All family members in good health',
    },
    status: 'completed',
  },
];

const HistoryPage = () => {
  const [activities, setActivities] = useState(initialActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emergency':
        return <Emergency color="error" />;
      case 'anc':
        return <PregnantWoman color="primary" />;
      case 'pnc':
        return <ChildCare color="secondary" />;
      case 'chw':
        return <Home color="success" />;
      default:
        return <Info />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'emergency':
        return 'error';
      case 'anc':
        return 'primary';
      case 'pnc':
        return 'secondary';
      case 'chw':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'resolved':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filterActivities = () => {
    return activities.filter((activity) => {
      // Search query filter
      const matchesSearch =
        searchQuery === '' ||
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(activity.type);

      // Status filter
      const matchesStatus =
        selectedStatus === '' || activity.status === selectedStatus;

      // Date range filter
      const matchesDate =
        (dateRange.start === '' ||
          activity.timestamp >= new Date(dateRange.start)) &&
        (dateRange.end === '' || activity.timestamp <= new Date(dateRange.end));

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  };

  const renderActivityDetails = (details) => {
    return (
      <Box sx={{ mt: 1 }}>
        {Object.entries(details).map(([key, value]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          
          if (value instanceof Date) {
            return (
              <Box key={key} sx={{ mb: 0.5 }}>
                <Typography component="span" variant="body2" color="text.secondary">
                  {label}: {value.toLocaleString()}
                </Typography>
              </Box>
            );
          }
          
          if (Array.isArray(value)) {
            return (
              <Box key={key} sx={{ mb: 0.5 }}>
                <Typography component="span" variant="body2" color="text.secondary">
                  {label}:
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {value.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      size="small"
                      sx={{ mr: 0.5, mt: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            );
          }
          
          return (
            <Box key={key} sx={{ mb: 0.5 }}>
              <Typography component="span" variant="body2" color="text.secondary">
                {label}: {value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Activity History
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Activity Type</InputLabel>
              <Select
                multiple
                value={selectedTypes}
                onChange={(e) => setSelectedTypes(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value.toUpperCase()}
                        size="small"
                        color={getTypeColor(value)}
                      />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="emergency">Emergency</MenuItem>
                <MenuItem value="anc">ANC</MenuItem>
                <MenuItem value="pnc">PNC</MenuItem>
                <MenuItem value="chw">CHW Visit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="From"
                  InputLabelProps={{ shrink: true }}
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="To"
                  InputLabelProps={{ shrink: true }}
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Timeline */}
      <Timeline position="alternate">
        {filterActivities().map((activity) => (
          <TimelineItem key={activity.id}>
            <TimelineOppositeContent color="text.secondary">
              {activity.timestamp.toLocaleString()}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={getTypeColor(activity.type)}>
                {getTypeIcon(activity.type)}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {activity.title}
                    </Typography>
                    <Chip
                      label={activity.status}
                      color={getStatusColor(activity.status)}
                      size="small"
                    />
                  </Box>
                  <Typography component="div" color="text.secondary">
                    {activity.description}
                  </Typography>
                  {renderActivityDetails(activity.details)}
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
};

export default HistoryPage;
