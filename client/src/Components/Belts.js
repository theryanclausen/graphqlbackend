import React from 'react'
import gql from 'graphql-tag'
import {Query, Mutation} from 'react-apollo'
import {Formik, Field} from 'formik'

export const BELTS_QUERY = gql`
    query BeltsQuery{
        belts{
            id
            name
        }
    }
    `
export const ADD_BELT = gql`
    mutation addBelt($name: String!){
        addBelt(name: $name){
            name
            id
        }
    }
`


export default function Belts() {
  return (
    <>
      <h2>The Belts</h2>
      <Query query={BELTS_QUERY}>
        {({loading, error, data})=>{
            if (loading) return <h5>loading...</h5>
            if (error) console.log(error)
            console.log(data)
            return (
                <ul>
                    {data.belts.map(belt=><li key={belt.id}>{belt.name}</li>)}
                </ul>
            )
        }}
      </Query>
      <Mutation mutation={ADD_BELT}
      update={(cache, {data:{addBelt}})=>{
          const {belts} = cache.readQuery({query: BELTS_QUERY})
            cache.writeQuery({
                query: BELTS_QUERY,
                data:{belts: belts.concat([addBelt])}
            })
      
        }}
      >
      {addBelt =>(
          <Formik
              initialValues={{name:''}}
              onSubmit={({name},{resetForm})=>{
                  addBelt({variables:{name}})
                  resetForm()
              }}
              render={props =>(
                  <form onSubmit={props.handleSubmit}>
                  <Field name='name' placeholder='add belt'/>
                  <button type="submit">Submit</button>
                  </form>
              )}
           >     
          </Formik>

      )}
      </Mutation>
    </>
  )
}
