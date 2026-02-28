import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from './custom/Button'
import { IconChevronsLeft, IconMenu2, IconX } from '@tabler/icons-react'
import { Layout, LayoutHeader, LayoutBody } from './custom/Layout'
import Nav from './Nav'
import { sideLinks } from '@/data/SideLink'
import { Link } from 'react-router-dom'

const Sidebar = ({ className, isCollapsed, setIsCollapsed }) => {
  const [navOpened, setNavOpened] = useState(false)

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-[500] w-full bg-background text-foreground transition-[width] md:z-50 md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className,
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] duration-100 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout>
        {/* Header */}
        <LayoutHeader className="sticky top-0 justify-between px-4 py-3 bg-green-600 text-white border-none md:px-4 min-h-[var(--header-height)]">
          <Link to={'/dashboard'}>
            <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
              <div className="flex items-center justify-center bg-white rounded-md p-1 shadow-sm">
                <img
                  src="/images/logo/logo-nobackground.png"
                  alt="Nam Viet Logo"
                  className={`transition-all object-contain ${isCollapsed ? 'block h-7 w-7' : 'block h-9 w-auto'}`}
                />
              </div>
              <span className="sr-only">NAM VIỆT</span>
              <div
                className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
              >
                <span className="mx-2 text-xl font-bold tracking-tight text-white uppercase drop-shadow-sm">
                  NAM VIỆT
                </span>
              </div>
            </div>
          </Link>
          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? (
              <IconX className="text-white" />
            ) : (
              <IconMenu2 className="text-white" />
            )}
          </Button>
        </LayoutHeader>

        <LayoutBody className="h-full flex-1 border-r-2 p-0 md:px-0">
          <Nav
            id="sidebar-menu"
            className={`h-full flex-1 overflow-y-auto overflow-x-hidden transition-all ${navOpened
              ? 'max-h-[80vh] py-2 md:max-h-screen'
              : 'max-h-0 py-0 md:max-h-screen md:py-2'
              }`}
            closeNav={() => setNavOpened(false)}
            isCollapsed={isCollapsed}
            links={sideLinks}
          />
        </LayoutBody>

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 hidden rounded-full md:inline-flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
    </aside>
  )
}

export default Sidebar
