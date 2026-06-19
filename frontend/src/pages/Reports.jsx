import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  LinearProgress,
  Alert,
  IconButton,  // ✅ ADDED THIS
} from '@mui/material';
import {
  PictureAsPdf,
  TableChart,
  Print,
  Download,
  BarChart,
  Inventory,
  Warning,
  Schedule,
  TrendingUp,
  TrendingDown,
  Search as SearchIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatters';

const Reports = () => {
  const theme = useTheme();
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportType, setReportType] = useState('inventory');
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const reportTypes = [
    { value: 'inventory', label: 'Inventory Report' },
    { value: 'low-stock', label: 'Low Stock Report' },
    { value: 'expiry', label: 'Expiry Report' },
    { value: 'sales', label: 'Sales Report' },
    { value: 'profit', label: 'Profit Analysis' },
  ];

  const recentReports = [
    { name: 'Inventory_Report_2026-06-19.pdf', date: 'Today, 2:30 PM', size: '2.4 MB', type: 'pdf' },
    { name: 'Low_Stock_Alert_2026-06-18.xlsx', date: 'Yesterday, 11:00 AM', size: '856 KB', type: 'excel' },
    { name: 'Expiry_Report_2026-06-17.pdf', date: 'Jun 17, 4:20 PM', size: '1.2 MB', type: 'pdf' },
    { name: 'Sales_Report_June_2026.xlsx', date: 'Jun 15, 9:00 AM', size: '3.1 MB', type: 'excel' },
  ];

  const stats = [
    { label: 'Total Reports Generated', value: '124', change: '+12%', trend: 'up' },
    { label: 'Reports This Month', value: '18', change: '+5%', trend: 'up' },
    { label: 'Most Generated', value: 'Inventory', change: '45%', trend: 'up' },
    { label: 'Download Rate', value: '78%', change: '-2%', trend: 'down' },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowPreview(true);
    }, 2000);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf sx={{ color: '#ef4444' }} />;
      case 'excel': return <TableChart sx={{ color: '#22c55e' }} />;
      default: return <PictureAsPdf />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate and download pharmacy reports
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  {stat.trend === 'up' ? (
                    <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />
                  )}
                  <Typography variant="caption" color={stat.trend === 'up' ? 'success.main' : 'error.main'}>
                    {stat.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Generation */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Generate Report
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                label="Report Type"
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              size="small"
              fullWidth
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={generating}
              fullWidth
              sx={{ height: 40 }}
            >
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          </Grid>
        </Grid>
        {generating && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>

      {/* Report Cards */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Quick Reports
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { icon: <Inventory />, title: 'Inventory Report', desc: 'Complete inventory status with stock levels', color: '#2563eb' },
          { icon: <Warning />, title: 'Low Stock Report', desc: 'List of all medicines below minimum stock', color: '#f59e0b' },
          { icon: <Schedule />, title: 'Expiry Report', desc: 'Medicines expiring in the next 30 days', color: '#ef4444' },
          { icon: <BarChart />, title: 'Sales Report', desc: 'Sales analytics with revenue breakdown', color: '#10b981' },
        ].map((report, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: `${report.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      color: report.color,
                    }}
                  >
                    {report.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {report.desc}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<PictureAsPdf />}>PDF</Button>
                    <Button size="small" startIcon={<TableChart />}>Excel</Button>
                    <Button size="small" startIcon={<Print />}>Print</Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Recent Reports */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Recent Reports
      </Typography>
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <List>
          {recentReports.map((report, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: index < recentReports.length - 1 ? '1px solid #e2e8f0' : 'none',
                '&:hover': { bgcolor: 'action.hover' },
                py: 2,
              }}
            >
              <ListItemIcon>{getIcon(report.type)}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" fontWeight={500}>{report.name}</Typography>
                    <Chip label={report.type.toUpperCase()} size="small" variant="outlined" />
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">{report.date}</Typography>
                    <Typography variant="caption" color="text.secondary">{report.size}</Typography>
                  </Box>
                }
              />
              <Button size="small" variant="outlined" startIcon={<Download />}>
                Download
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>
          Report Preview
          <IconButton
            sx={{ position: 'absolute', right: 16, top: 16 }}
            onClick={() => setShowPreview(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Report generated successfully!
          </Alert>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, minHeight: 200 }}>
            <Typography variant="caption" color="text.secondary">
              Report content will appear here...
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button variant="contained" startIcon={<Download />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;