"use client";

import { Drawer } from "@conorroberts/beluga";

interface Props {
  setOpen: (value: boolean) => void;
  open: boolean;
}

const NavigationDrawer = ({ setOpen, open }: Props) => {
  return (
    <Drawer onOpenChange={() => setOpen(false)} open={open}>
      <div className="flex flex-col h-full">
        {/* <div className="relative w-[calc(250px/1.5)] h-[calc(75px/1.5)] mx-auto">
          <Image src="/images/text-logo.svg" layout="fill" objectFit="contain" alt="Logo" priority loading="eager" />
        </div> */}
      </div>
    </Drawer>
  );
};

export default NavigationDrawer;
