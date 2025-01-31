import React from 'react';
import {
    Card, CardBody, Text, Stack
} from '@chakra-ui/react'


export default function TimeElapsed() {
    return (
        <Card w={"500px"} maxH={600} overflowY={"auto"}>
            <CardBody>
                <Text fontSize="1rem">What you need to do is to use the “send message” block.

                    send message with name “Stopwatch:Start” starts the stopwatch, “Stopwatch:Stop”, stops it and prints in the console the elapsed time.

                    In the send message block with name “Stopwatch:Stop” you can also pass a message that will be printed to console along with the elapsed time </Text>
            </CardBody>
        </Card>

    );
}
