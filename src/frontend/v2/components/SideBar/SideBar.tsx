import FunctionTab from './NavigationTab';
import FolderTab from './FolderTab';

export default function SideBar(){
    return (
        <>
            {/* TODO: Cleanup FunctionTab which directly migrated from old project */}
            <FunctionTab/>
            <FolderTab/>
        </>
    )
}