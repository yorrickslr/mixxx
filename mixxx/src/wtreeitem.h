//
// C++ Interface: wtreeitem
//
// Description: 
//
//
// Author: Tue Haste Andersen <haste@diku.dk>, (C) 2003
//
// Copyright: See COPYING file that comes with this distribution
//
//
#ifndef WTREEITEM_H
#define WTREEITEM_H

#include <qlistview.h>
#include <qwidget.h>
#include <qobject.h>
class Track;

/**
@author Tue Haste Andersen
*/
class WTreeItem : public QListViewItem
{
public:
    WTreeItem(QListView *parent);
    WTreeItem(QListView *parent, const QString &s1);
    WTreeItem(WTreeItem *parent);
    WTreeItem(WTreeItem *parent, const QString &s1);
    WTreeItem(WTreeItem *parent, const QString &s1, const QString &s2);
    ~WTreeItem();

    virtual QString type() { return "WTreeItem"; };

    virtual void popupMenu() {};
    virtual QString drag();
    static void setTrack(Track *pTrack);
    
protected:
    static Track *spTrack;
};

#endif
