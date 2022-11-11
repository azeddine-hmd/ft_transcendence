# react-containers

[![Build Status](https://img.shields.io/gitlab/pipeline/wmira/react-containers.svg?style=for-the-badge)](https://gitlab.com/wmira/react-containers/pipelines)[![coverage report](https://gitlab.com/wmira/react-containers/badges/master/coverage.svg)](https://gitlab.com/wmira/react-containers/commits/master)
[![npm version](https://img.shields.io/npm/v/react-containers.svg?style=for-the-badge)](https://badge.fury.io/js/react-containers)


# Usage

```
    npm install --save react-containers
```

```javascript
import {
    Center
    Render
    LeftRightSection,
    InlineItems,
    findChild,
    MappingOver,
    WrappingChildren
} from 'react-containers'

```

# Motivation

The following components can be used to write a more declarative React components.
These components combined with others like styled-components for example provides
with a much more easier to read source code.

Take for example the source code of a component below

```javascript

render() {

    return (
        <div className={css.container}>
            { this.state.items.map( (item,index) => {
                return (
                    <Item 
                        onClick={this.onItemClicked}
                        key={index} 
                        data={item}>
                        { item.name }
                    </Item>
                )
            })}
        </div>

    )

}

```

Although the code above works, it is much easier to read something like
the one below

```javascript
...
renderItem = (item, index) => (
    <Item 
        onClick={this.onItemClicked}
        key={index} 
        data={item}>
        { item.name }
    </Item>
)

render() {

    return (
        <Container>
            <MappingOver collection={this.state.items}>
                { this.renderItem }
            </MappingOver>
        </Container>

    )

}

...

```

# Components

## Left and Right Sections

Provide a left and/or right section. The first element is the left section while the second element is the right section. Note that if you only require a right section then make sure that the first element is not empty.


Left And Right Section

```javascript
import { LeftRightSection, Center } from 'react-containers';

//left and right
<LeftRightSection>                   
    <ProductTitle>Cool Product</ProductTitle>
    <Center><Menus/></Center>
</LeftRightSection>     

```

Right Side Only


```javascript
import { LeftRightSection, Center } from 'react-containers';

<LeftRightSection>
    <div/>
    <Center><Menus/></Center>
</LeftRightSection>

```

## InlineItems

Renders item inline with a spacing. Similar to something like what flex will do by default.

```javascript
render() {
    return (
        <div style={{display: 'flex'}}>
            <div className={'spacer'}><MySpecialElement/></div>
            <div className={'spacer'}><MyOtherElement/></div>
        </div>
    )
}
```

can be replaced with something like

```javascript

render() {
    return (
        <InlineItems>
            <Container><MySpecialElement/></Container>
            <Container><MyOtherElement/></Container>
        </InlineItems>
    )
}

```

To prevent repetition, you can do something like

```javascript

render() {
    return (
        <InlineItems container={Container}>
            <MySpecialElement/>
            <MyOtherElement/>
        </InlineItems>
    )
}

```


## Center

This container will center horizontally and vertically a component rendered inside.

```javascript

import { Center } from 'react-containers'

<div style={{width: 250, height: 250}}>
    <Center><SomeComponent /></Center>
</div>

```

You can also choose to specify the dimension of the container...

```javascript

import { Center } from 'react-containers'


<Center style={{width: 250, height: 250}}>
    <SomeComponent />
</Center>


```

## Render if

Will call the function child if ifTrue attribute is true. Note that the child can be an element
or a function but it is advisable to pass a function if you dont want the element created
in cases where ifTrue attribute is initially false.

```javascript
<RenderIf expr={this.props.shouldRender}>
   { (props) => <MyComponent {...props} /> };
</RenderIf>

//below is the same but the function child is not created on subsequent render

class MyComponent extends React.Component {

    showToggledView = () => {
        return <ToggledView {...this.props.toggledProps }/>;
    }

    render() {
        return (
            <div>
                <SomeComponent />
                <Render ifTrue={this.props.isToggled}>
                    { this.showToggledView }
                </RenderIf>
            </div>
        )
    }

}
```

## MappingOver

Map over a given collection specifying the function that returns the component
that maps over the element. Make sure your renderer adds a key

```javascript

import { MappingOver } from 'react-containers'

...
renderItem = (item, index) => (
    <Item 
        onClick={this.onItemClicked}
        key={index} 
        data={item}>
        { item.name }
    </Item>
)

render() {

    return (
        <Container>
            <MappingOver collection={this.state.items}>
                { this.renderItem }
            </MappingOver>
        </Container>

    )

}

...
```

The component can also use an functional component as the child. MappingOver will automatically 
create a React Element.

```javascript

const Item = (props) => {
    const { element, index, collection, data } = props

    return (
        <div key={index}>{index}</div>
    )
}

// from another component

return (
    <Container>
        <MappingOver collection={this.state.items}>
            { Item }
        </MappingOver>
    </Container>

)

```

## findChild

findChild is particularly useful for finding elements when you want to create tagger elements.
Consider the following component

```javascript

// MyComponent.js

export const Header = (props) => {
    throw new Error('should not render')
}
export const Body = (props) => {
    throw new Error('should not render')
}
export const Title = (props) => {
    throw new Error('should not render')
}

export const App = (props) => {
    const titleElement = findChild(Title, props)
    const headerElement = findChild(Header, props)
    const bodyElement = findChild(Body, props)
    
    return (
        <Container>
            <LeftRightSection>
                <TitleContainer>{ titleElement.props.children }</TitleElement>
                <MainHeaderContainer>{ headerElement.props.children }</TitleElement>
            </LeftRightSection>
            <BodyContainer>
                { bodyElement.props.children }
            </BodyContainer>
        </Container>
    )
}

```

Now your users will just create MyApp with something like

```javascript

    import { Header, Body, Title, App } from 'myawesomeapp'

    render() {
        return (
            <App>
                <Title><Strong>My App Here</Strong></Title>
                <Header><Menus /></Header>
                <Body><MyAppContent></Body>                
            </App>
        )
    }

```

This makes for a far better declarative way of using your component
as they dont need to worry about structuring it but only declaring sections


# Contributing

You can submit a propasal if you have a container you wanted to contribute.
