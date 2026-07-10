import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch, FormControlLabel, Paper, Divider } from '@mui/material';
import { Header } from '../components/Header';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export const AjustesPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem('notifications_enabled');
    if (savedPreference !== null) {
      setNotificationsEnabled(savedPreference === 'true');
    }
  }, []);

  const handleToggleNotifications = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notifications_enabled', String(newValue));
  };

  return (
    <Box className="fade-in">
      <Header title="Ajustes" backHref="/" homeHref="/" />
      <Box sx={{ maxWidth: 768, mx: 'auto', p: 2, pb: 10 }}>
        <Paper className="card" sx={{ p: 3, borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <SettingsIcon sx={{ color: '#8C261F' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2B2B2B' }}>
              Configuración del Sistema
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <NotificationsActiveIcon color="action" />
                <Box>
                  <Typography sx={{ fontWeight: 'medium' }}>Notificaciones de Stock</Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Recibir alertas cuando los productos tengan stock bajo.
                  </Typography>
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch 
                    checked={notificationsEnabled} 
                    onChange={handleToggleNotifications}
                    color="primary"
                  />
                }
                label="" 
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
