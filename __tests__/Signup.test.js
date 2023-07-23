import { render, fireEvent, act } from '@testing-library/react-native';
import SignupPage from '../src/screen/Authentication/SignupPage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Alert } from 'react-native';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

jest.mock('firebase/auth');
jest.mock('firebase/app');
jest.mock('firebase/database');
jest.mock('firebase/storage');

beforeEach(() => {
    initializeApp.mockImplementation(() => {});
    getAuth.mockImplementation(() => {});
    getDatabase.mockImplementation(() => {});
    getStorage.mockImplementation(() => {});
});


let alertSpy;

beforeEach(() => {
  alertSpy = jest.spyOn(Alert, 'alert');
});

afterEach(() => {
  alertSpy.mockRestore();
});

describe('signupUser function', () => {

    it('Navigate to Signup2 screen when signup successfully with a valid email and password', async () => {
        //Mock the navigation object
        const navigation = {
            replace: jest.fn()
        };
  
        //Virtually render the component
        const { getByPlaceholderText, getByText } = render(<SignupPage navigation={navigation} />);
    
        //Simulate user input and trigger the signupUser function
        const emailInput = getByPlaceholderText('Enter your email address');
        const passwordInput1 = getByPlaceholderText('Enter your password');
        const passwordInput2 = getByPlaceholderText('Confirm your password');
        const signupButton = getByText('Sign up');
        const userCredential = { user: { displayName: null }};
    
        createUserWithEmailAndPassword.mockResolvedValue(userCredential);
    
        await act(async () => {
            await fireEvent.changeText(emailInput, 'test@example.com');
            await fireEvent.changeText(passwordInput1, 'password');
            await fireEvent.changeText(passwordInput2, 'password');
            await fireEvent.press(signupButton);
        })
        
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(undefined, 'test@example.com', 'password');
        expect(navigation.replace).toHaveBeenCalledWith('Signup2');
    });

    it('Alert when signup unsuccessfully with an invalid email and password', async () => {
        //Mock the navigation object
        const navigation = {
            replace: jest.fn()
        };
  
        //Virtually render the component
        const { getByPlaceholderText, getByText } = render(<SignupPage navigation={navigation} />);
    
        //Simulate user input and trigger the signupUser function
        const emailInput = getByPlaceholderText('Enter your email address');
        const passwordInput1 = getByPlaceholderText('Enter your password');
        const passwordInput2 = getByPlaceholderText('Confirm your password');
        const signupButton = getByText('Sign up');
       
        createUserWithEmailAndPassword.mockRejectedValue({
            //just one of the examples of error
            code: "auth/invalid-email",
            message: ''
        });
    
        await act(async () => {
            await fireEvent.changeText(emailInput, '');
            await fireEvent.changeText(passwordInput1, 'password');
            await fireEvent.changeText(passwordInput2, 'password');
            await fireEvent.press(signupButton);
        });

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(undefined, '', 'password');
        expect(alertSpy).toHaveBeenCalledWith('Invalid email address');
    });
}) 