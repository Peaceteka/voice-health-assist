import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalHospital,
  Phone,
  DirectionsCar,
  Warning,
  Healing,
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';

const emergencyContacts = [
  { name: 'Emergency Services', number: '911', icon: <Phone /> },
  { name: 'Poison Control', number: '1-800-222-1222', icon: <Warning /> },
  { name: 'Local Hospital', number: '+254-XX-XXXXXXX', icon: <LocalHospital /> },
  { name: 'Ambulance Service', number: '+254-XX-XXXXXXX', icon: <DirectionsCar /> },
];

const emergencyCategories = [
  {
    title: 'Heart Attack',
    symptoms: [
      'Chest pain or pressure',
      'Pain in arms, neck, jaw, or back',
      'Shortness of breath',
      'Cold sweat',
      'Nausea',
    ],
    actions: [
      'Call emergency services immediately',
      'Chew aspirin if available and no known allergies',
      'Rest in a comfortable position',
      'Loosen tight clothing',
    ],
  },
  {
    title: 'Stroke',
    symptoms: [
      'Sudden numbness in face/arm/leg',
      'Confusion, trouble speaking',
      'Difficulty seeing',
      'Loss of balance',
      'Severe headache',
    ],
    actions: [
      'Remember FAST: Face, Arms, Speech, Time',
      'Call emergency services immediately',
      'Note the time symptoms started',
      'Do not give food or drink',
    ],
  },
  {
    title: 'Severe Bleeding',
    symptoms: [
      'Heavy blood flow',
      'Deep wounds',
      'Embedded objects',
      'Pale and clammy skin',
    ],
    actions: [
      'Apply direct pressure with clean cloth',
      'Keep the injured area elevated',
      'Do not remove embedded objects',
      'Call emergency services',
    ],
  },
];

const EmergencyPage = () => {
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleEmergencyClick = (emergency) => {
    setSelectedEmergency(emergency);
  };

  const handleClose = () => {
    setSelectedEmergency(null);
  };

  const handleCallEmergency = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert
        severity="error"
        sx={{ mb: 4 }}
        action={
          <Button
            color="error"
            size="small"
            variant="contained"
            onClick={() => handleCallEmergency('911')}
            startIcon={<Phone />}
          >
            CALL 911
          </Button>
        }
      >
        If this is a life-threatening emergency, call emergency services immediately!
      </Alert>

      <Grid container spacing={4}>
        {/* Emergency Contacts Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Emergency Contacts
            </Typography>
            <List>
              {emergencyContacts.map((contact) => (
                <ListItem
                  key={contact.name}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>{contact.icon}</ListItemIcon>
                  <ListItemText
                    primary={contact.name}
                    secondary={contact.number}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleCallEmergency(contact.number)}
                    startIcon={<Phone />}
                  >
                    Call
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Emergency Categories Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Emergency Guidelines
          </Typography>
          <Grid container spacing={2}>
            {emergencyCategories.map((emergency) => (
              <Grid item xs={12} sm={6} key={emergency.title}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    height: '100%',
                  }}
                  onClick={() => handleEmergencyClick(emergency)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h6" color="error">
                      {emergency.title}
                    </Typography>
                    <ArrowForward color="action" />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Click for emergency guidelines
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Location Services */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nearby Emergency Services
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LocalHospital />}
                  onClick={() =>
                    window.open(
                      'https://www.google.com/maps/search/hospitals+near+me',
                      '_blank'
                    )
                  }
                >
                  Find Nearest Hospital
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LocationOn />}
                  onClick={() =>
                    window.open(
                      'https://www.google.com/maps/search/emergency+rooms+near+me',
                      '_blank'
                    )
                  }
                >
                  Find Emergency Rooms
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Emergency Details Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={Boolean(selectedEmergency)}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedEmergency && (
          <>
            <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
              {selectedEmergency.title} - Emergency Guidelines
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Common Symptoms:
              </Typography>
              <List>
                {selectedEmergency.symptoms.map((symptom, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Warning color="error" />
                    </ListItemIcon>
                    <ListItemText primary={symptom} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Immediate Actions:
              </Typography>
              <List>
                {selectedEmergency.actions.map((action, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Healing color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={action} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleCallEmergency('911')}
                startIcon={<Phone />}
              >
                Call Emergency Services
              </Button>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default EmergencyPage;
