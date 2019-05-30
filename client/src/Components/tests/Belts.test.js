import React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import renderer from "react-test-renderer";
import wait from "waait";


import Belts, { BELTS_QUERY, ADD_BELT } from "../Belts";

const mocks = [
  {
    request: {
      query: BELTS_QUERY
    },
    result: {
      data: {
        belts: [
          {
            name: "World Heavyweight Championship",
            id: "1"
          },
          {
            name: "Intercontinental Championship",
            id: "2"
          }
        ]
      }
    }
  }
]

it ('renders without error', ()=>{
    renderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
        <Belts/>
        </MockedProvider>
    )
})