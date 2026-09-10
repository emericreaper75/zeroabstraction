import { Display, Title, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Link } from 'next-view-transitions';

export default async function ProjectsArchive() {
  const payload = await getPayload({ config: configPromise });
  const projects = await payload.find({
    collection: 'projects',
    sort: '-year',
  });

  return (
    <div className="container-wide pb-32">
      <header className="py-24 md:py-32">
        <Display>Projects</Display>
      </header>

      <div className="flex flex-col" style={{ gap: 'var(--space-10)' }}>
        {projects.docs.map((project, index) => {
          const isEven = index % 2 === 0;
          const imageUrl = typeof project.cover_image === 'object' && project.cover_image?.url ? project.cover_image.url : '/placeholder.svg';
          const imageAlt = typeof project.cover_image === 'object' && project.cover_image?.alt_text ? project.cover_image.alt_text : `MISSING ALT TEXT - ${project.title}`;
          
          return (
            <div key={project.id} className="grid grid-cols-1 md:grid-cols-12 items-center" style={{ gap: 'var(--space-8)' }}>
              <div className={`md:col-span-7 ${!isEven ? 'md:order-2 order-1' : ''}`}>
                <Link href={`/projects/${project.slug}`} style={{ display: 'block' }}>
                  <ProjectImage transitionName={`project-hero-${project.slug}`} src={imageUrl} alt={imageAlt} width={800} height={600} className="w-full h-auto" />
                </Link>
              </div>
              <div className={`md:col-span-5 flex flex-col items-start ${!isEven ? 'md:order-1 order-2' : ''}`} style={{ gap: 'var(--space-4)' }}>
                <Title as="h3">{project.title}</Title>
                <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-3)' }}>
                  <Label className="text-[color:var(--muted)]">{project.year || new Date().getFullYear()}</Label>
                  <span className="text-[color:var(--muted)]">•</span>
                  {project.technologies && project.technologies.length > 0 && (
                    <Label className="text-[color:var(--muted)]">
                      {project.technologies.slice(0, 2).map((t: any) => t.name).join(' & ').toUpperCase()}
                    </Label>
                  )}
                </div>
                <Body className="text-[color:var(--muted)]">
                  {project.summary}
                </Body>
                <EditorialLink href={`/projects/${project.slug}`} style={{ marginTop: 'var(--space-2)' }}>VIEW PROJECT</EditorialLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
