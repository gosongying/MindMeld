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
        runTransaction.mockImplementation((ref, callback) => {
            callback({username: 'test'});
            return new Promise(() => ({committed: false}))
        })

        await act(async () => {
            await fireEvent.press(button);
            const usernameInput = getByTestId('usernameInput');
            await fireEvent.changeText(usernameInput, 'test');
            await fireEvent(usernameInput, 'submitEditing');
        });

        expect(alertSpy).toHaveBeenCalledWith('Username already exists')
        expect(remove).not.toHaveBeenCalled();
        expect(update).not.toHaveBeenCalled();
        expect(updateProfile).not.toHaveBeenCalled();
    });
});