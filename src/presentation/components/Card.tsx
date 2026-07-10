import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

interface CardProps {
  to: string;
  icon: string; // Material Icon name
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaColor: string;
}

export const Card: React.FC<CardProps> = ({
  to,
  icon,
  iconBgColor,
  iconColor,
  title,
  subtitle,
  ctaText,
  ctaColor,
}) => {
  return (
    <MuiLink
      component={Link}
      to={to}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 4,
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        transition: 'transform 0.1s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: iconBgColor,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <span className="material-symbols-outlined fill" style={{ fontSize: 40 }}>
          {icon}
        </span>
      </Box>
      <Typography variant="h5" component="h3" sx={{ fontWeight: 'semibold', fontSize: 19, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#57423f', mb: 1.5 }}>
        {subtitle}
      </Typography>
      <Typography sx={{ color: ctaColor, fontWeight: 'semibold', fontSize: 14, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {ctaText} <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
      </Typography>
    </MuiLink>
  );
};
