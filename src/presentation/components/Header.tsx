import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  backHref?: string;
  onBack?: () => void;
  homeHref?: string;
  settingsHref?: string;
  notificacionesHref?: string;
  notificacionesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  backHref,
  onBack,
  homeHref,
  settingsHref,
  notificacionesHref,
  notificacionesCount = 0,
}) => {
  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 40, bgcolor: '#FEF9F0', borderBottom: '1px solid rgba(212, 163, 115, 0.3)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {backHref || onBack ? (
            <IconButton 
              component={backHref ? Link : 'button'} 
              to={backHref}
              onClick={onBack}
              color="inherit" 
              sx={{ color: '#8C261F' }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Box sx={{ width: 40, height: 40 }} />
          )}
          <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', fontSize: 20, color: '#8C261F' }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {homeHref && (
            <IconButton component={Link} to={homeHref} color="inherit" title="Inicio" sx={{ color: '#8C261F' }}>
              <HomeIcon />
            </IconButton>
          )}
          {notificacionesHref && (
            <IconButton component={Link} to={notificacionesHref} color="inherit" title="Notificaciones" sx={{ color: '#8C261F' }}>
              <Badge badgeContent={notificacionesCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}
          {settingsHref && (
            <IconButton component={Link} to={settingsHref} color="inherit" title="Ajustes" sx={{ color: '#8C261F' }}>
              <SettingsIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
