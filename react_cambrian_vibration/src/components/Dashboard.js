import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { MainListItems/*, secondaryListItems*/ } from './listItems';
import { connect } from "react-redux";
import { /*BrowserRouter,*/ Routes, Route/*, Link*/ } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { logout }  from '../actions/auth';
//import { history } from '../helpers/history';
/*import Chart from './Charts';
import Deposits from './Deposits';
import Orders from './Orders';*/
import SearchList from './searchbox';
import Client from './client';
import Sensor from './sensor';
import Location from './location';
import User from './user';
import MapView from './map';
import Report from './reports';
import DashboardContent from './dashboardcontent';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://cambrian.com.sg/">
        Cambrian Engineering Pte. Ltd.
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#5775A0", //"#FF4500", //"#5775A0", //"#690204", //primary - light blue
    },
    secondary: {
      main: "#303A5D", //secondary - navy blue
    },
  },
});

function Dashboard(props) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const signout = () => {
    console.log(props);
    const { dispatch/*, history*/ } = props;

    dispatch(logout());
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
      {/*<BrowserRouter history = {history}>*/}
        <CssBaseline />
        <AppBar position="absolute" open={open} style={{ background: '#b00d0d' }}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="img"
              sx={{
                height: '6vh',
                width: '6vw',
                //maxHeight: { xs: 233, md: 167 },
                //maxWidth: { xs: 350, md: 250 },
              }}
              alt="logo"
              src="logo.bmp"
            />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, fontFamily:"Georgia, serif", textShadow: "5px 5px 5px gray", paddingLeft: "5px"}}
            >
            {/* Cambrian Engineering Corporation Pte Ltd */}
            </Typography>
            <Typography>
              {props.userInfo.username}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={signout}>
                <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems userInfo={props.userInfo}/>
            <Divider sx={{ my: 1 }} />
            {/*{secondaryListItems}*/}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/*<Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  {"Chart"}
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  {"Depositclients"}
                </Paper>
              </Grid>*/}
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '80vh', overflow:'auto' }}>
                <Routes>
                    <Route path="client" element={<Client/>} />
                    <Route path="location" element={<Location/>} />
                    <Route path="sensor" element={<Sensor/>} />
                    <Route path="register" element={<User />} />
                    <Route path="report" element={<Report />} />
                    {/* <Route path="/" element={<SearchList />} /> */}
                    <Route path="/" element={<DashboardContent />} />
                    <Route path="dashboard" element={<DashboardContent />} />
                    {/* <Route path="dashboard" element={<SearchList />} /> */}
                    <Route path="map" element={<MapView />} />
                  
                </Routes>                
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
        {/*</BrowserRouter>*/}
      </Box>
    </ThemeProvider>
  );
}

function mapStateToProps(state) {
  const { isLoggedIn, userInfo } = state.auth;
  //const { message } = state.message;
  return {
    isLoggedIn,
    userInfo
    //message
  };
}

export default connect(mapStateToProps)(Dashboard);