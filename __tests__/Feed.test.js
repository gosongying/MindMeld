import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import {ref, onValue, get, push, runTransaction, child, set, update, remove} from 'firebase/database';
import Feeds from '../src/components/Home/Feed/Feeds';
import { onAuthStateChanged} from 'firebase/auth';
import { database } from '../firebase';

const navigation = {
    goBack: jest.fn()
};

let alertSpy;
beforeEach(() => {
    alertSpy = jest.spyOn(Alert, 'alert');
});
afterEach(() => {
    alertSpy.mockRestore();
    navigation.goBack.mockRestore()
    //navigation.navigate.mockRestore();
    //navigation.pop.mockRestore();
});

jest.mock('firebase/database');
jest.mock('firebase/auth')

jest.useFakeTimers();

let setIntervalSpy;
let setTimeoutSpy;
beforeEach(() => {
    setIntervalSpy = jest.spyOn(window, 'setInterval');
    setTimeoutSpy = jest.spyOn(window, 'setTimeout');
});
afterEach(() => {
    setIntervalSpy.mockRestore();
    setTimeoutSpy.mockRestore();
});

describe('Study Feed', () => {
    it('can create new feed', async () => {
        onAuthStateChanged.mockReturnValue();
        ref.mockReturnValue({push: () => {}});
        onValue.mockReturnValue(() => {});
        update.mockResolvedValue();
        set.mockResolvedValue();
        push.mockReturnValue({key: 'test'});

        const postData = {
            title: 'Test',
            userId: undefined,
            content: '',
            isClosed: false,
            timestamp: new Date().getTime(),
            commentsCount: 0,
            comments: [],
            id: 'test'
        };

        const {getByText, getByPlaceholderText, getByTestId} = render(<Feeds navigation={navigation}/>);
        await act(async () => {
            await fireEvent.press(getByTestId('add'));
            await fireEvent.changeText(getByPlaceholderText('Title'), 'Test');
            await fireEvent.press(getByText('Create Feed'));
        });

        expect(update.mock.calls).toHaveLength(2);
        expect(set).toHaveBeenCalledWith(child(ref(database, 'posts'), 'Test'), postData);
    });

    it('can delete post', async () => {

        const postData = {
            title: 'Test',
            userId: undefined,
            content: '',
            isClosed: false,
            timestamp: new Date().getTime(),
            commentsCount: 0,
            comments: [],
            id: 'test'
        };

        const posts = {
            'test': postData
        };

        const snapshot = {
            val: () => posts
        };

        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(true);
        });
        ref.mockReturnValue({push: () => {}});
        update.mockResolvedValue();
        set.mockResolvedValue();
        push.mockReturnValue({key: 'test'});
        onValue.mockImplementation((ref, callback) => {
            callback(snapshot);
            return () => {};
        });
       // onValue.mockReturnValue(()=> {})
        remove.mockResolvedValue();

        const {getByPlaceholderText, getByTestId, getByText} = render(<Feeds/>);
        await act(async () => {
            await fireEvent.press(getByTestId('deletetest'));
            const deleteButton = alertSpy.mock.calls[0][2][1]
            await deleteButton.onPress()
        })
        expect(alertSpy).toHaveBeenCalled();
        expect(remove).toHaveBeenCalled();
    });

    it('can close post', async () => {
        const postData = {
            title: 'Test',
            userId: undefined,
            content: '',
            isClosed: false,
            timestamp: new Date().getTime(),
            commentsCount: 0,
            comments: [],
            id: 'test'
        };

        const posts = {
            'test': postData
        };

        const snapshot = {
            val: () => posts
        };

        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(true);
        });
        ref.mockReturnValue({push: () => {}});
        update.mockResolvedValue();
        set.mockResolvedValue();
        push.mockReturnValue({key: 'test'});
        onValue.mockImplementation((ref, callback) => {
            callback(snapshot);
            return () => {};
        });
       // onValue.mockReturnValue(()=> {})
        remove.mockResolvedValue();

        const {getByPlaceholderText, getByTestId, getByText} = render(<Feeds/>);
        await act(async () => {
            await fireEvent.press(getByTestId('closetest'));
            const closeButton = alertSpy.mock.calls[0][2][1]
            await closeButton.onPress()
        })
        expect(alertSpy).toHaveBeenCalled();
        expect(update).toHaveBeenCalledWith(expect.anything(), {isClosed: true});
    });

    it('can edit post', async () => {

        const postData = {
            title: 'Test',
            userId: undefined,
            content: '',
            isClosed: false,
            timestamp: new Date().getTime(),
            commentsCount: 0,
            comments: [],
            id: 'test'
        };

        const posts = {
            'test': postData
        };

        const snapshot = {
            val: () => posts
        };

        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(true);
        });
        ref.mockReturnValue({push: () => {}});
        update.mockResolvedValue();
        set.mockResolvedValue();
        push.mockReturnValue({key: 'test'});
        onValue.mockImplementation((ref, callback) => {
            callback(snapshot);
            return () => {};
        });
       // onValue.mockReturnValue(()=> {})
        remove.mockResolvedValue();

        const {getByPlaceholderText, getByTestId, getByText} = render(<Feeds/>);
        await act(async () => {
            await fireEvent.press(getByTestId('edittest'));
            await fireEvent.changeText(getByPlaceholderText('body text (optional)'), 'Test');
            await fireEvent.press(getByText('Edit Post'));
        });
        expect(update).toHaveBeenCalledWith(expect.anything(), {
            title: "Test", 
            content: "Test"
        });
    })
});
