import FunctionTab from './NavigationTab';
import FolderTab from './FolderTab';
import styled from '@emotion/styled';

const Wrapper = styled.div`   
    min-width: 340px;
    height: 100px;
`


export default function SideBar(){
    return (
        <Wrapper>
            {/* TODO: Cleanup FunctionTab which directly migrated from old project */}
            <FunctionTab/>
            <FolderTab/>
        </Wrapper>
    )
}