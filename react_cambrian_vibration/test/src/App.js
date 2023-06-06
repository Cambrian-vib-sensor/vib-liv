import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import SignInSide from './components/SignInSide';
import Dashboard from './components/Dashboard';
import { BrowserRouter} from "react-router-dom";
import { history } from './helpers/history';
import { connect } from 'react-redux';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // We can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
    console.log(errorInfo);
    this.setState({
      errInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. {this.state.errInfo}</h1>;
    }

    return this.props.children; 
  }
}


function App(props) {
  const { isLoggedIn } = props;
  let component;
  if (isLoggedIn) {
    component = <Dashboard />;
  } else {
    component = <SignInSide />;
  }
  return (
    <ErrorBoundary>
      <BrowserRouter history = {history}>
        {/*<Routes>
          Routes are defined inside Dashboard component
        </Routes>*/}
        {component}
      </BrowserRouter>
    </ErrorBoundary>
  )
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  //const { message } = state.message;
  return {
    isLoggedIn
  };
}

export default connect(mapStateToProps)(App);
