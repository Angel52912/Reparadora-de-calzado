import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import { Link } from 'react-router-dom'; // Suponiendo react-router-dom para navegación

interface HeaderProps {
  title: string;
  backHref?: string;
  homeHref?: string;
  settingsHref?: string;
  extraHref?: string;
  extraIcon?: string; // Material Icon name
  extraTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  backHref,
  homeHref,
  settingsHref,
  extraHref,
  extraIcon = 'history',
  extraTitle = 'Historial',
}) => {
  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 40, bgcolor: '#FEF9F0', borderBottom: '1px solid rgba(212, 163, 115, 0.3)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {backHref ? (
            <IconButton component={Link} to={backHref} color="inherit" sx={{ color: '#8C261F' }}>
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Box sx={{ width: 40, height: 40 }} /> // Placeholder to maintain alignment
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
          {extraHref && (
            <IconButton component={Link} to={extraHref} color="inherit" title={extraTitle} sx={{ color: '#8C261F' }}>
              {extraIcon === 'history' ? <HistoryIcon /> : <span className="material-symbols-outlined">{extraIcon}</span>}
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
