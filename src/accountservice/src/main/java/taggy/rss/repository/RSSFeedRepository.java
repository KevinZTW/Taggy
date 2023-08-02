package taggy.rss.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import taggy.rss.entity.RSSFeed;
public interface RSSFeedRepository extends JpaRepository<RSSFeed, String> {
    
    List<RSSFeed> findAll();
    Optional<RSSFeed> findById(String id);

}