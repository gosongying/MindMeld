import { render, fireEvent, act } from '@testing-library/react-native';
import SignupPage2, { uploadImageAsync } from '../src/screen/Authentication/SignupPage2';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInAnonymously, updateProfile } from 'firebase/auth';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { runTransaction, set } from 'firebase/database';

jest.mock('firebase/auth');
jest.mock('firebase/storage');
jest.mock('expo-image-picker');
jest.mock('firebase/database');

let alertSpy;
beforeEach(() => {
alertSpy = jest.spyOn(Alert, 'alert');
});

afterEach(() => {
alertSpy.mockRestore();
});

const navigation = {
    replace: jest.fn()
};

afterEach(() => {
    navigation.replace.mockRestore()
})

describe('selectImageLibrary function', () => {
    it('Should select and set image when permission is granted and image is chosen', async () => {
        //virtually render the screen
        const { getByTestId } = render(<SignupPage2 navigation={navigation}/>);
        const libraryButton = getByTestId('1');

        //mock the image selected
        const imageUri = 'path/to/image.jpg';

        // Mocking permission status
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });

        // Mocking image selection
        ImagePicker.launchImageLibraryAsync.mockResolvedValue({
        cancelled: false,
        assets: [{ uri: imageUri }],
        });

        await act(async () => {
            await fireEvent.press(libraryButton);
        })

        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        expect(alertSpy).not.toHaveBeenCalled();

        ImagePicker.requestMediaLibraryPermissionsAsync.mockRestore();
        ImagePicker.launchImageLibraryAsync.mockRestore();
    });

    it('Should display alert when permission for library is denied', async () => {
        //virtually render the screen
        const { getByTestId } = render(<SignupPage2 navigation={navigation}/>);
        const libraryButton = getByTestId('1');

        //mock the image selected
        const imageUri = 'path/to/image.jpg';

        // Mocking permission status
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'denied' });

        await act(async () => {
            await fireEvent.press(libraryButton);
        })
    
        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('Permission denied');
    });
});

describe('selectImageCamera function', () => {
    it('Should select and set image when permission is granted and image is taken', async () => {
        //virtually render the screen
        const { getByTestId } = render(<SignupPage2 navigation={navigation}/>);
        const cameraButton = getByTestId('2');

        //mock the image selected
        const imageUri = 'path/to/image.jpg';

        // Mocking permission status
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ status: 'granted' });

        // Mocking image selection
        ImagePicker.launchCameraAsync.mockResolvedValue({
        cancelled: false,
        assets: [{ uri: imageUri }],
        });

        await act(async () => {
            await fireEvent.press(cameraButton);
        })

        expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
        expect(alertSpy).not.toHaveBeenCalled();

        ImagePicker.requestCameraPermissionsAsync.mockRestore();
        ImagePicker.launchCameraAsync.mockRestore();
    });

    it('Should display alert when permission for camera is denied', async () => {
        //virtually render the screen
        const { getByTestId } = render(<SignupPage2 navigation={navigation}/>);
        const cameraButton = getByTestId('2');

        //mock the image selected
        const imageUri = 'path/to/image.jpg';

        // Mocking permission status
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ status: 'denied' });

        await act(async () => {
            await fireEvent.press(cameraButton);
        })
    
        expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('Permission denied');
    });
});

describe('handleToggleConfirmUsername', () => {
    it('should display an alert when username is empty', () => {
        //virtually render the screen
        const {getByTestId, getByPlaceholderText} = render(<SignupPage2 navigation={navigation}/>);
        const confirmUsernameButton = getByTestId('3');
        const usernameInput = getByPlaceholderText('Enter your username');
        const username = '';

        fireEvent.changeText(usernameInput, username);
        fireEvent.press(confirmUsernameButton);

        expect(alertSpy).toHaveBeenCalledWith('Username cannot be empty');
    });

    it('should display an alert when username is Guest', () => {
        //virtually render the screen
        const {getByTestId, getByPlaceholderText} = render(<SignupPage2 navigation={navigation}/>);
        const confirmUsernameButton = getByTestId('3');
        const usernameInput = getByPlaceholderText('Enter your username');
        const username = 'Guest';

        fireEvent.changeText(usernameInput, username);
        fireEvent.press(confirmUsernameButton);

        expect(alertSpy).toHaveBeenCalledWith("Username cannot be \"Guest\"");
    });

    it('should display an alert when username contains special characters', () => {
        //virtually render the screen
        const {getByTestId, getByPlaceholderText} = render(<SignupPage2 navigation={navigation}/>);
        const confirmUsernameButton = getByTestId('3');
        const usernameInput = getByPlaceholderText('Enter your username');
        const username = '!test';

        fireEvent.changeText(usernameInput, username);
        fireEvent.press(confirmUsernameButton);

        expect(alertSpy).toHaveBeenCalledWith('Username cannot contain special characters');
    });

    it('should display an alert when username contains whitespace', () => {
        //virtually render the screen
        const {getByTestId, getByPlaceholderText} = render(<SignupPage2 navigation={navigation}/>);
        const confirmUsernameButton = getByTestId('3');
        const usernameInput = getByPlaceholderText('Enter your username');
        const username = 'test test';

        fireEvent.changeText(usernameInput, username);
        fireEvent.press(confirmUsernameButton);

        expect(alertSpy).toHaveBeenCalledWith('No whitespace allowed in the username');
    });
});

describe('handleConfirmDetails', () => {
    it('should navigate to Home screen when successfully set up profile', async () => {
        const { getByText, getByPlaceholderText, getByTestId } = render(<SignupPage2 navigation={navigation}/>);

        const usernameInput = getByPlaceholderText('Enter your username');

        runTransaction.mockResolvedValue({
            committed: true
        });

        updateProfile.mockResolvedValue();
        set.mockResolvedValue()

        await act(async () => {
            await fireEvent.changeText(usernameInput, 'test');
            //select male as gender
            await fireEvent.press(getByTestId('male'));
            await fireEvent.press(getByTestId('3'));
            await fireEvent.press(getByTestId('4'));
            // virtually press the next button
            await fireEvent.press(getByText('Next'));
        });
        
        expect(navigation.replace).toHaveBeenCalled();
    });

    it('should display an alert when any of the runTransaction, set and updateProfile gets rejected', async () => {
        const { getByText, getByPlaceholderText, getByTestId } = render(<SignupPage2 navigation={navigation}/>);

        const usernameInput = getByPlaceholderText('Enter your username');

        runTransaction.mockResolvedValue({
            committed: true
        });

        updateProfile.mockResolvedValue();
        set.mockRejectedValue('Error');

        await act(async () => {
            await fireEvent.changeText(usernameInput, 'test');
            //select male as gender
            await fireEvent.press(getByTestId('male'));
            await fireEvent.press(getByTestId('3'));
            await fireEvent.press(getByTestId('4'));
            // virtually press the next button
            await fireEvent.press(getByText('Next'));
        });
        
        expect(navigation.replace).not.toHaveBeenCalled()
        expect(alertSpy).toHaveBeenCalled();
    })
})

