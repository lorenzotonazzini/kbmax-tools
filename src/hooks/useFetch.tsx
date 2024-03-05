import { useEffect, useState } from "react";

interface FetchResult {
    data: any,
    code: number
}

export const useFetch = () => {
    const [fetchData, setData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);



    const getFetchBackground = (url: string) =>
        fetch(url).then(res => {
            return {
                code: res.status,
                data: res.json()
            }
        }).catch(e => {
            return {
                code: 500
            }
        });

    const postFetchBackground = (url: string, body: any) =>
        fetch(url, {
            method: "POST",
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
            if (tabs[0].id)
                await chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id,
                    },
                    func: getFetchBackground,
                    args: [url],
                }).then(injectionResults => {
                    handleFetchResult(injectionResults[0].result)
                });
        });

    }

    const doFetchPost = async (resource: string, body: any) => {
        //set state
        setError(false);
        setData(null);
        setLoading(true);

        return chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
            if (tabs[0].id && tabs[0].url) {
                const companyName = tabs[0].url.split(".com")[0] + ".com";
                await chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id,
                    },
                    func: postFetchBackground,
                    args: [companyName + resource, body],
                }).then(injectionResults => {
                    handleFetchResult(injectionResults[0].result)
                });
            }

        });

    }

    return { fetchData, error, loading, doFetchGet, doFetchPost };
};