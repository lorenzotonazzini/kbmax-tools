import { useEffect, useState } from "react";

interface FetchResult {
    data: any,
    code: number
}

export const useFetch = () => {
    const [multipleFetchData, setMultipleFetchData] = useState([] as any[]);
    const [fetchData, setData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [multipleDeleteResult, setMultipleDeleteResult] = useState([] as boolean[]);

    const getFetchBackground = (url: string) =>
        fetch(url).then(res => (res.ok) ? res.json() : res.status);

    const postFetchBackground = (url: string, body: any) =>
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then(res => (res.ok) ? res.json() : res.status);



    const putFetchBackground = (url: string, body: any) =>
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }).then(res => (res.ok) ? res.json() : res.status);

    const handleFetchResult = async (result: any) => {

        //error
        if (!isNaN(+result)) {
            setError(true);
        }
        setData(result);

        setLoading(false);
    }
    const doFetchGet = (url: string) => {
        //set state
        setError(false);
        setData(null);
        setLoading(true);

        chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
            if (tabs[0].id) {
                await chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id,
                    },
                    func: getFetchBackground,
                    args: [url],
                }).then(injectionResults => handleFetchResult(injectionResults[0].result));
            }

        });
    }

    const multipleFetchGet = (resources: string[]) => {
        //set state
        setError(false);
        setMultipleFetchData([]);
        setLoading(true);

        chrome.tabs.query({ currentWindow: true, active: true }).
            then(tabs => {
                if (tabs[0].id) {
                    const promiseArr = resources.map(resource => chrome.scripting.executeScript({
                        target: {
                            tabId: tabs[0].id as number,
                        },
                        func: getFetchBackground,
                        args: [resource],
                    }).then(injectionResults => injectionResults[0].result));

                    Promise.all(promiseArr).then((res) => {
                        setMultipleFetchData([...res]);
                        setLoading(false)
                    });
                    //Promise.all(promiseArr).then(() => setLoading(false)).then((res) => console.log(res));
                }

            })
    }

    const doFetchPost = async (resource: string, body: any) => {
        //set state
        setError(false);
        setData(null);
        setLoading(true);

        chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
            if (tabs[0].id) {
                await chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id,
                    },
                    func: postFetchBackground,
                    args: [resource, body],
                }).then(injectionResults => handleFetchResult(injectionResults[0].result));
            }

        });

    }

    const doFetchPut = async (resource: string, body: any) => {
        //set state
        setError(false);
        setData(null);
        setLoading(true);

        chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
            if (tabs[0].id) {
                await chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id,
                    },
                    func: putFetchBackground,
                    args: [resource, body],
                }).then(injectionResults => handleFetchResult(injectionResults[0].result));
            }

        });

    }

    const deleteFetchBackground = (url: string) =>
        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => (res.ok) ? res.json() : res.status);

    const doFetchDelete = async (resource: string) => {
        //set state
        setError(false);
        setData(null);
        setLoading(true);

        chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
            if (tabs[0].id) {
                await chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id,
                    },
                    func: deleteFetchBackground,
                    args: [resource],
                }).then(injectionResults => handleFetchResult(injectionResults[0].result));
            }

        });

    }

    const multipleDelete = (resources: string[]) => {
        //set state
        setError(false);
        setMultipleDeleteResult([]);
        setLoading(true);

        chrome.tabs.query({ currentWindow: true, active: true }).
            then(tabs => {
                if (tabs[0].id) {
                    const promiseArr = resources.map(resource => chrome.scripting.executeScript({
                        target: {
                            tabId: tabs[0].id as number,
                        },
                        func: deleteFetchBackground,
                        args: [resource],
                    }).then(injectionResults => injectionResults[0].result));

                    Promise.all(promiseArr).then((res) => {
                        setMultipleDeleteResult([...res.map(result => true)])
                        setLoading(false)
                    });
                }

            })
    }

    return { fetchData, multipleFetchData, error, loading, doFetchGet, doFetchPost, doFetchPut, multipleFetchGet, doFetchDelete, multipleDelete, multipleDeleteResult };
};