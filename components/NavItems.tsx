import React from 'react';
import {ListGroup, Collapse} from 'react-bootstrap';
import FolderFill from 'bootstrap-icons/icons/folder-fill.svg';
import GearFill from 'bootstrap-icons/icons/gear-fill.svg';
import Search from 'bootstrap-icons/icons/search.svg';
import Pencil from 'bootstrap-icons/icons/pencil.svg';
import BoxSeamFill from 'bootstrap-icons/icons/box-seam-fill.svg';
import BugFill from 'bootstrap-icons/icons/bug-fill.svg';
import PlusSquareFill from 'bootstrap-icons/icons/plus-square-fill.svg';
import BracesAsterisk from 'bootstrap-icons/icons/braces-asterisk.svg';
import InfoCircleFill from 'bootstrap-icons/icons/info-circle-fill.svg';
import Link from 'next/link';
import {useRouter} from 'next/router';
export default function NavItems({ open }: any) {
  const router = useRouter();
  const isActive = (routes: string[]) => routes.includes(router.pathname);
  return (
    <Collapse in={open}>
      <div>
      <small className="text-muted">Plugin Developers</small>
      <ListGroup as="ul" className="mb-3">
        <Link href="/create" legacyBehavior>
          <ListGroup.Item as="li" active={isActive(['/create'])}>
            <BoxSeamFill width="1.25em" height="1.25em" /> Make{' '}
            <code>.phar</code>
          </ListGroup.Item>
        </Link>
        <Link href="/extract" legacyBehavior>
          <ListGroup.Item as="li" active={isActive(['/extract'])}>
            <FolderFill width="1.25em" height="1.25em" /> Extract{' '}
            <code className="code-text">.phar</code>
          </ListGroup.Item>
        </Link>
        <Link href="/inject" legacyBehavior>
          <ListGroup.Item as="li" active={isActive(['/inject'])}>
            <GearFill width="1.25em" height="1.25em" /> API Injector
          </ListGroup.Item>
        </Link>
        <Link href="/crashdump-parser" legacyBehavior>
          <ListGroup.Item
            as="li"
            active={isActive(['/crashdump-parser'])}
          >
            <BugFill width="1.25em" height="1.25em" /> Crashdump
            Parser
          </ListGroup.Item>
        </Link>
        <Link href="/pmf-decoder" legacyBehavior>
          <ListGroup.Item
            as="li"
            active={isActive(['/pmf-decoder'])}
          >
            <BracesAsterisk width="1.25em" height="1.25em" /> Decode{' '}
            <code>.pmf</code>
          </ListGroup.Item>
        </Link>
        <Link href="/generate" legacyBehavior>
          <ListGroup.Item as="li" active={isActive(['/generate'])}>
            <PlusSquareFill width="1.25em" height="1.25em" />{' '}
            Generate skeleton plugin
          </ListGroup.Item>
        </Link>
      </ListGroup>
      <small className="text-muted">Server Admins</small>
      <ListGroup as="ul">
        <Link href="/poggit-search" legacyBehavior>
          <ListGroup.Item
            as="li"
            active={isActive(['/poggit-search'])}
          >
            <Search width="1.25em" height="1.25em" /> Poggit Search
          </ListGroup.Item>
        </Link>
        <Link href="/motd-generator" legacyBehavior>
          <ListGroup.Item
            as="li"
            active={isActive(['/motd-generator'])}
          >
            <Pencil width="1.25em" height="1.25em" /> MOTD Generator
          </ListGroup.Item>
        </Link>
        <Link href="/ping" legacyBehavior>
          <ListGroup.Item
            as="li"
            active={isActive(['/ping'])}
          >
            <InfoCircleFill width="1.25em" height="1.25em" /> Ping server
          </ListGroup.Item>
        </Link>
      </ListGroup>
      </div>
    </Collapse>
  );
}
