import { render, fireEvent, act } from '@testing-library/react-native';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInAnonymously, updateProfile } from 'firebase/auth';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { runTransaction, set, ref as databaseRef, get, remove, update, onValue } from 'firebase/database';
import Details from '../src/components/Home/Settings/Details';
import React from 'react';

jest.mock('firebase/auth');
jest.mock('firebase/storage');
jest.mock('expo-image-picker');
jest.mock('firebase/database');

/*let useEffectSpy;
beforeEach(() => {
    useEffectSpy = jest.spyOn(React, 'useEffect');
});

afterEach(() => {
    useEffectSpy.mockRestore();
});*/

//to mock Alert.alert
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

describe('handleChangeUsername function', () => {
    it('successfully update with a valid username', async () => {
        onValue.mockReturnValueOnce(() => {});
        //virtually render the component
        const { getByTestId } = render(<Details navigation={navigation}/>);
        const button = getByTestId('editUsername');

        //mock those functions called 
        databaseRef.mockReturnValueOnce();
        get.mockResolvedValue({ val: 'testing' });
        runTransaction.mockResolvedValue({committed: true});
        remove.mockResolvedValue();
        update.mockResolvedValue();
        updateProfile.mockResolvedValue();

        await act(async () => {
            await fireEvent.press(button);
            const usernameInput = getByTestId('usernameInput');
            await fireEvent.changeText(usernameInput, 'test');
            await fireEvent(usernameInput, 'submitEditing');
        });

        expect(alertSpy).toHaveBeenCalledWith("Success", 'Username updated');
        expect(remove).toHaveBeenCalled();
        expect(update).toHaveBeenCalled();
        expect(updateProfile).toHaveBeenCalled();

        runTransaction.mockRestore()
        remove.mockRestore();
        update.mockRestore();
        updateProfile.mockRestore();
    });

    it('unsuccessfully update if the username already exists', async () => {
        onValue.mockReturnValueOnce(() => {});
        const { getByTestId } = render(<Details navigation={navigation}/>);
        const button = getByTestId('editUsername');

        //mock those functions called 
        databaseRef.mockReturnValueOnce();
        get.mockResolvedValue({ val: 'testing' });
        //username does not get updated
        runTransaction.mockResolvedValue({committed: false});

        await act(async () => {
            await fireEvent.press(button);
            const usernameInput = getByTestId('usernameInput');
            await fireEvent.changeText(usernameInput, 'test');
            await fireEvent(usernameInput, 'submitEditing');
        });

        expect(alertSpy).not.toHaveBeenCalled()
        expect(remove).not.toHaveBeenCalled();
        expect(update).not.toHaveBeenCalled();
        expect(updateProfile).not.toHaveBeenCalled();
    });
});

/*describe('selectImageLibrary function', () => {
    it('Should select and upload image when permission is granted and image is chosen', async () => {
        const xhrMockClass = () => ({
            //open            : jest.fn(),
            //send            : jest.fn(),
            //setRequestHeader: jest.fn(),
            onload : jest.fn(),
            onerror : jest.fn(),
            responseType : '',
            open : jest.fn(),
            send : jest.fn()
          })
          
          global.XMLHttpRequest = jest.fn(xhrMockClass)//.mockImplementation(xhrMockClass)
          let xhrMock = {
            open: jest.fn(),
            onload: jest.fn(),
            onerror: jest.fn(),
            send: jest.fn(),
            responseType: ''
          }
      
         global.XMLHttpRequest = jest.fn(() => xhrMock)
        onValue.mockReturnValueOnce(() => {});
        //virtually render the screen
        const { getByTestId } = render(<Details navigation={navigation}/>);
        const libraryButton = getByTestId('selectImageLibrary');

        //mock the image selected
        const imageUri = 'path/to/image.jpg';

        // Mocking permission status
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });

        // Mocking image selection
        ImagePicker.launchImageLibraryAsync.mockResolvedValue({
        cancelled: false,
        assets: [{ uri: imageUri }],
        });

        update.mockResolvedValueOnce();
        updateProfile.mockResolvedValueOnce();

        const mockUri = 'image-uri';
        const mockCurrentUser = { uid: 'user-uid' };
        const mockBlob = { close: jest.fn() };
        const mockFileRef = { path: 'storage-path' };
        const mockDownloadURL = 'download-url';

        const mockUploadBytes = jest.fn().mockResolvedValue();
        const mockGetDownloadURL = jest.fn().mockResolvedValue(mockDownloadURL);

        storageRef.mockImplementation(() => mockFileRef);
        uploadBytes.mockImplementation(mockUploadBytes);
        getDownloadURL.mockImplementation(mockGetDownloadURL);


        await act(async () => {
            await fireEvent.press(libraryButton);
        })

        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        expect(alertSpy).not.toHaveBeenCalled();
        //expect(uploadBytes).toHaveBeenCalledWith(mockFileRef, expect.any(Object));
        //expect(getDownloadURL).toHaveBeenCalledWith(mockFileRef);

        ImagePicker.requestMediaLibraryPermissionsAsync.mockRestore();
        ImagePicker.launchImageLibraryAsync.mockRestore();
    }, 100000);

    it('Should display alert when permission for library is denied', async () => {
        onValue.mockReturnValueOnce(() => {});
        //virtually render the screen
        const { getByTestId } = render(<Details navigation={navigation}/>);
        const libraryButton = getByTestId('selectImageLibrary');

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
});*/