import { render, fireEvent, act } from '@testing-library/react-native';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInAnonymously, updateProfile } from 'firebase/auth';
import { Alert } from 'react-native';
import { runTransaction, set, ref, get, remove, update, onValue, child } from 'firebase/database';
import Details from '../src/components/Home/Settings/Details';
import React from 'react';
import FriendListSetting from '../src/screen/Home/Tabs/Settings/FriendListSetting';

jest.mock('firebase/auth');
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

describe('handleSearchFriend function', () => {
    it('can search for others by their username', async () => {
        onValue.mockReturnValue(() => {});
        const { getByTestId, getByPlaceholderText } = render(<FriendListSetting navigation={navigation}/>);

        const addFriendButton = getByTestId('addFriend');

        await act(async () => {
            await fireEvent.press(addFriendButton);
        });

        const searchFriendButton = getByTestId('searchFriend');
        const usernameInput = getByTestId('Enter username');

        ref.mockReturnValueOnce();
        //to mock that the user searched exists
        get.mockResolvedValue({
            exists: () => true,
            val: () => ({xp: 100, uid: 'test'})
        });

        await act(async () => {
            await fireEvent.changeText(usernameInput, 'test');
            await fireEvent.press(searchFriendButton);
        });

        expect(alertSpy).not.toHaveBeenCalled();
        expect(get.mock.calls).toHaveLength(2);

        get.mockRestore();
    });
});

describe('addFriend function', () => {
    it('can add other users', async () => {
        onValue.mockReturnValue(() => {});
        const { getByTestId, getByPlaceholderText } = render(<FriendListSetting navigation={navigation}/>);

        const addFriendButton = getByTestId('addFriend');

        await act(async () => {
            await fireEvent.press(addFriendButton);
        });

        const searchFriendButton = getByTestId('searchFriend');
        const usernameInput = getByTestId('Enter username');

        ref.mockReturnValue();
        //to mock that the user searched exists
        get.mockResolvedValue({
            exists: () => true,
            val: () => ({xp: 100, uid: 'test', username: 'test'})
        });
        child.mockReturnValue();
        runTransaction.mockResolvedValue();

        await act(async () => {
            await fireEvent.changeText(usernameInput, 'test');
            await fireEvent.press(searchFriendButton);
        });

        const addButton = getByTestId('add');

        await act(async () => {
            fireEvent.press(addButton);
        })

        expect(alertSpy).toHaveBeenCalledWith('Added successfully!');
        expect(runTransaction.mock.calls).toHaveLength(2);
    });
});