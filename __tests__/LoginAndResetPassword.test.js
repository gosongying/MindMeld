import { render, fireEvent, act } from '@testing-library/react-native';
import LoginPage from '../src/screen/Authentication/LoginPage';
import LandingPage from '../src/screen/Authentication/LandingPage';
import { signInWithEmailAndPassword, signInAnonymously, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { Alert } from 'react-native';

jest.mock('firebase/auth');

const navigation = {
  replace: jest.fn()
};

let alertSpy;
  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

describe('loginUser function', () => {

  it('Navigate to Home screen if user login successfully and has a display name', async () => {
    //Virtually render the component
    const { getByPlaceholderText, getByText } = render(<LoginPage navigation={navigation} />);

    //Simulate user input and trigger the loginUser function
    const emailInput = getByPlaceholderText('Enter your email address');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Login');
    const userCredential = { user: { displayName: 'test' }};

    signInWithEmailAndPassword.mockResolvedValue(userCredential);

    await fireEvent.changeText(emailInput, 'test@example.com');
    await fireEvent.changeText(passwordInput, 'password');
    await fireEvent.press(loginButton);
    
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@example.com', 'password');
    expect(navigation.replace).toHaveBeenCalledWith('Home');
  });

  it('Navigate to Signup2 screen if user login successfully and does not have a display name', async () => {

    //Virtually render the component
    const { getByPlaceholderText, getByText } = render(<LoginPage navigation={navigation} />);

    //Simulate user input and trigger the loginUser function
    const emailInput = getByPlaceholderText('Enter your email address');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Login');
    const userCredential = { user: { displayName: null }};

    signInWithEmailAndPassword.mockResolvedValue(userCredential);

    await fireEvent.changeText(emailInput, 'test@example.com');
    await fireEvent.changeText(passwordInput, 'password');
    await fireEvent.press(loginButton);
    
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@example.com', 'password');
    expect(navigation.replace).toHaveBeenCalledWith('Signup2');
  });

  it('Alert when login unsuccessfully with an invalid email and password', async () => {
    //Mock the navigation object
    const navigation = {
      replace: jest.fn()
    };
    signInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-email",
      message: ''
    });
  
    // Mock Alert.alert to capture the alert message
    //const alertSpy = jest.spyOn(Alert, 'alert');

    //Virtually render the component
    const { getByPlaceholderText, getByText } = render(<LoginPage navigation={navigation} />);
    const emailInput = getByPlaceholderText('Enter your email address');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Login');

    await act(async () => {
      await fireEvent.changeText(emailInput, 'test@example.com');
      await fireEvent.changeText(passwordInput, '');
      await fireEvent.press(loginButton);
    });
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@example.com', '');
    expect(navigation.replace).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalled();

  });
});

describe('resetPassword function', () => {
  it('send reset password email with valid email provided', async () => {

    const { getByTestId, getByPlaceholderText, getByText } = render(<LoginPage navigation={navigation} />);
    const forgotPassword = getByText('Forgot your password?');

    await act(async () => {
      fireEvent.press(forgotPassword);
    })

    const emailResetInput = getByTestId('1');
    const confirmButton = getByTestId('2');
    const email = 'test@example.com';

    // Mock the sendPasswordResetEmail function
    sendPasswordResetEmail.mockResolvedValue();

    // Trigger the resetPassword function
    await act(async () => {
      await fireEvent.changeText(emailResetInput, email);
      await fireEvent.press(confirmButton);
    });
    // Assertions
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(undefined, email);
    expect(alertSpy).toHaveBeenCalledWith('Email Sent', 'A password reset link has been sent to your email.');
  });

  it('error when an invalid email provided', async () => {

    const { getByTestId, getByPlaceholderText, getByText } = render(<LoginPage navigation={navigation} />);
    const forgotPassword = getByText('Forgot your password?');

    //to make the reset password modal visible
    await act(() => {
      fireEvent.press(forgotPassword);
    })

    const emailResetInput = getByTestId('1');
    const confirmButton = getByTestId('2');
    const email = '';

    // Mock the sendPasswordResetEmail function
    sendPasswordResetEmail.mockRejectedValue({
      code: "auth/missing-email",
      message: ''
    });

    // Trigger the resetPassword function
    await act(async () => {
      await fireEvent.changeText(emailResetInput, email);
      await fireEvent.press(confirmButton);
    })

    // Assertions
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(undefined, email);
    expect(alertSpy).toHaveBeenCalledWith('Email cannot be empty');
  });
  
  describe("continueAsGuest function", () => {
    it ('Navigate to Home screen when successfully signin anonymously', async () => {

      const {getByText} = render(<LandingPage navigation={navigation}/>);
      const continueAsGuestButton = getByText('Continue as a guest');

      //Mock the signInAnonymously function
      signInAnonymously.mockResolvedValue();

      await act(async () => {
        await fireEvent.press(continueAsGuestButton);
      });
  
      expect(signInAnonymously).toHaveBeenCalled();
      expect(navigation.replace).toHaveBeenCalledWith('Home');
    })
  })
});

