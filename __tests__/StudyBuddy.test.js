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

describe('Study Buddy', () => {
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

    /*it('can delete friend', async () => {
        const snapshot1 = {
            val: () => ({
                friendList: ['test'],
                uid: 'test'
            })
        };
        const test = {
            username: 'test',
            uid: 'test',
            gender: 'male',
            numberOfComments: 1,
            numberOfFeeds: 5,
            status: 0,
            timeInSession: 10,
            xp: 100
        };

        const snapshot2 = {
            val: () => test
        };
        ref.mockReturnValue();
        onValue.mockImplementationOnce((ref, callback) => {
            callback(snapshot1);
            return () => {};
        });
        onValue.mockImplementationOnce((ref, callback) => {
            callback(snapshot2);
            return () => {};
        });
        onValue.mockReturnValue(() => {})
        get.mockResolvedValue({
            val: () => test
        });
        child.mockReturnValue();
        runTransaction.mockResolvedValue();
        const {getByTestId, getByText} = render(<FriendListSetting navigation={navigation}/>);
        await act(async () => {
            await fireEvent.press(getByTestId('test'));
            await fireEvent.press(getByText('Confirm'));
        });
        expect(alertSpy).toHaveBeenCalledWith('a')
        expect(runTransaction.mock.calls).toHaveLength(2);
    })*/
});