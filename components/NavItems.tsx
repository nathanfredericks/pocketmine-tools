'use client';
import React from 'react';
import { ListGroup, Collapse } from 'react-bootstrap';
import FolderFill from 'bootstrap-icons/icons/folder-fill.svg';
import GearFill from 'bootstrap-icons/icons/gear-fill.svg';
import Search from 'bootstrap-icons/icons/search.svg';
import Pencil from 'bootstrap-icons/icons/pencil.svg';
import BoxSeamFill from 'bootstrap-icons/icons/box-seam-fill.svg';
import BugFill from 'bootstrap-icons/icons/bug-fill.svg';
import PlusSquareFill from 'bootstrap-icons/icons/plus-square-fill.svg';
import BracesAsterisk from 'bootstrap-icons/icons/braces-asterisk.svg';
import InfoCircleFill from 'bootstrap-icons/icons/info-circle-fill.svg';
import HeartFill from 'bootstrap-icons/icons/heart-fill.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function NavItems({ open }: { open: boolean }) {
  const pathname = usePathname();
  const isActive = (routes: string[]) => routes.includes(pathname);
  const date = new Date();
  const year = date.getFullYear();
  return (
    <Collapse in={open}>
      <div>
        <small className="text-muted">Plugin Developers</small>
        <ListGroup as="ul" className="mb-3">
          <ListGroup.Item as={Link} href="/create" active={isActive(['/create'])} action>
            <BoxSeamFill width="1.25em" height="1.25em" /> Create{' '}
            <code>.phar</code>
          </ListGroup.Item>
          <ListGroup.Item as={Link} href="/extract" active={isActive(['/extract'])} action>
            <FolderFill width="1.25em" height="1.25em" /> Extract{' '}
            <code className="code-text">.phar</code>
          </ListGroup.Item>
          <ListGroup.Item as={Link} href="/inject" active={isActive(['/inject'])} action>
            <GearFill width="1.25em" height="1.25em" /> API Injector
          </ListGroup.Item>
          <ListGroup.Item as={Link} href="/crashdump-parser" active={isActive(['/crashdump-parser'])} action>
            <BugFill width="1.25em" height="1.25em" /> Crashdump Parser
          </ListGroup.Item>
          <ListGroup.Item as={Link} href="/pmf-decoder" active={isActive(['/pmf-decoder'])} disabled action>
            <BracesAsterisk width="1.25em" height="1.25em" /> Decode{' '}
            <code>.pmf</code>
          </ListGroup.Item>
          <ListGroup.Item as={Link} href="/generate" active={isActive(['/generate'])} action>
            <PlusSquareFill width="1.25em" height="1.25em" /> Generate
            skeleton plugin
          </ListGroup.Item>
        </ListGroup>
        <small className="text-muted">Server Admins</small>
        <ListGroup as="ul">
          <ListGroup.Item as={Link} href="/poggit-search" active={isActive(['/poggit-search'])} action>
            <Search width="1.25em" height="1.25em" /> Poggit Search
          </ListGroup.Item>
          <ListGroup.Item as={Link} href="/motd-generator" active={isActive(['/motd-generator'])} action>
            <Pencil width="1.25em" height="1.25em" /> MOTD Generator
          </ListGroup.Item>
          <ListGroup.Item as={Link} href="/ping" active={isActive(['/ping'])} action>
            <InfoCircleFill width="1.25em" height="1.25em" /> Ping server
          </ListGroup.Item>
        </ListGroup>
        <footer className="pt-3 text-body-secondary">
          &copy; {year} Nathan Fredericks
          <br />
          Made with <HeartFill className="text-danger" /> in Canada
        </footer>
      </div>
    </Collapse>
  );
}
