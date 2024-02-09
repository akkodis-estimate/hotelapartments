import { Drawer } from "@mantine/core";

const MobileDrawer = ({
  title,
  openDrawer,
  setopenDrawer,
  children,
  classText = false,
  overlayProps = "",
  className = "",
 
  isFullScreen= false
}) => {
  return (
    <>
      <Drawer
      title={title}
         size="75%"
        className={`${isFullScreen ? 'SAFullScreenDrawer' : ''} ${classText ? 'bookingForSmSa' : ''}`}
        // overlayProps={overlayProps}
        position="bottom"
        opened={openDrawer}
        onClose={() => {
          setopenDrawer(!openDrawer);
        }}
      >
        {children}
      </Drawer>
    </>
  );
};

export default MobileDrawer;

